import { Project } from '../models/Project.js';

export const createProject = async (req, res, next) => {
  try {
    const { title, description, category, thumbnailUrl, deployedUrl } = req.body;

    if (!title || !description || !deployedUrl) {
      return res.status(400).json({ message: 'Title, description, and deployed URL are required' });
    }

    const project = await Project.create({
      user: req.user.id,
      title,
      description,
      category,
      thumbnailUrl,
      deployedUrl,
      status: 'pending',
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

export const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ created_at: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const updateMyProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own project' });
    }

    const updatableFields = ['title', 'description', 'category', 'thumbnailUrl', 'deployedUrl'];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const deleteMyProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

export const getApprovedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ status: 'approved' })
      .sort({ created_at: -1 })
      .populate('user', 'fullName');

    res.json(projects);
  } catch (err) {
    next(err);
  }
};
