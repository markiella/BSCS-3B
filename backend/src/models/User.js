import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student'], default: 'student' },
    status: { type: String, enum: ['active', 'deactivated'], default: 'active' },
    contactNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    birthday: { type: String, trim: true },
    profileImageUrl: { type: String, trim: true },
    facebookUrl: { type: String, trim: true },
    instagramUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const User = mongoose.model('User', userSchema);
