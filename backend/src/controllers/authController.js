import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'BSCS3B@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bscsclass2025';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email is already in use. Please login instead.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email: email.toLowerCase(), passwordHash });

    const token = signToken({ id: user._id, role: user.role, fullName: user.fullName, email: user.email });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        contactNumber: user.contactNumber,
        address: user.address,
        birthday: user.birthday,
        profileImageUrl: user.profileImageUrl,
        facebookUrl: user.facebookUrl,
        instagramUrl: user.instagramUrl,
        githubUrl: user.githubUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(400).json({ message: 'Only students can change password via this endpoint' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const token = signToken({
        id: 'admin',
        role: 'admin',
        fullName: 'BSCS 3B Instructor',
        email: ADMIN_EMAIL,
      });

      return res.json({
        token,
        user: {
          id: 'admin',
          fullName: 'BSCS 3B Instructor',
          email: ADMIN_EMAIL,
          role: 'admin',
          status: 'active',
        },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ message: 'Account is deactivated. Please contact the instructor.' });
    }

    const token = signToken({ id: user._id, role: user.role, fullName: user.fullName, email: user.email });

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        contactNumber: user.contactNumber,
        address: user.address,
        birthday: user.birthday,
        profileImageUrl: user.profileImageUrl,
        facebookUrl: user.facebookUrl,
        instagramUrl: user.instagramUrl,
        githubUrl: user.githubUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return res.json({
        id: 'admin',
        fullName: 'BSCS 3B Instructor',
        email: ADMIN_EMAIL,
        role: 'admin',
        status: 'active',
      });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(400).json({ message: 'Admin profile cannot be updated via this endpoint' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatableFields = [
      'fullName',
      'contactNumber',
      'address',
      'birthday',
      'profileImageUrl',
      'facebookUrl',
      'instagramUrl',
      'githubUrl',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    return res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      contactNumber: user.contactNumber,
      address: user.address,
      birthday: user.birthday,
      profileImageUrl: user.profileImageUrl,
      facebookUrl: user.facebookUrl,
      instagramUrl: user.instagramUrl,
      githubUrl: user.githubUrl,
    });
  } catch (err) {
    next(err);
  }
};
