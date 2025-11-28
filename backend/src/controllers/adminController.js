import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';

export const getStats = async (req, res, next) => {
  try {
    const [totalStudents, totalProjects, approvedProjects, pendingProjects, latestProjects] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'approved' }),
      Project.countDocuments({ status: 'pending' }),
      Project.find().sort({ created_at: -1 }).limit(5).populate('user', 'fullName email'),
    ]);

    res.json({
      totalStudents,
      totalProjects,
      approvedProjects,
      pendingProjects,
      latestProjects,
    });
  } catch (err) {
    next(err);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const { q, status } = req.query;
    const filter = { role: 'student' };

    if (status) {
      filter.status = status;
    }

    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const students = await User.find(filter).sort({ created_at: -1 }).select('-passwordHash');

    if (students.length === 0) {
      return res.json([]);
    }

    const studentIds = students.map((s) => s._id);

    const projectStats = await Project.aggregate([
      { $match: { user: { $in: studentIds } } },
      {
        $group: {
          _id: '$user',
          projectsCount: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ['$status', 'approved'] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
            },
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const statsByStudent = new Map();
    projectStats.forEach((stat) => {
      statsByStudent.set(String(stat._id), stat);
    });

    const result = students.map((student) => {
      const key = String(student._id);
      const stat = statsByStudent.get(key) || {};

      return {
        id: key,
        name: student.fullName,
        email: student.email,
        section: 'BSCS 3B',
        projectsCount: stat.projectsCount || 0,
        approved: stat.approved || 0,
        pending: stat.pending || 0,
        rejected: stat.rejected || 0,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateStudentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'deactivated'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Project.deleteMany({ user: id });
    await user.deleteOne();

    res.json({ message: 'Student and related projects deleted' });
  } catch (err) {
    next(err);
  }
};

export const resetStudentPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user || user.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const tempPassword = `bscs-${Math.random().toString(36).slice(-8)}`;
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    user.passwordHash = passwordHash;
    await user.save();

    return res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      temporaryPassword: tempPassword,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const { status, q, email } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (q) {
      filter.title = { $regex: q, $options: 'i' };
    }

    let projects = await Project.find(filter)
      .sort({ created_at: -1 })
      .populate('user', 'fullName email');

    if (email) {
      projects = projects.filter((p) => p.user && p.user.email.toLowerCase().includes(email.toLowerCase()));
    }

    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const updateProjectStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true }
    ).populate('user', 'fullName email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const updateProjectByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatableFields = ['title', 'description', 'category', 'thumbnailUrl', 'deployedUrl'];

    const update = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });

    const project = await Project.findByIdAndUpdate(id, update, { new: true }).populate('user', 'fullName email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const deleteProjectByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
