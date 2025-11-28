import express from 'express';
import { register, login, me, updateProfile, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, me);
router.patch('/me', authenticate, updateProfile);
router.post('/password', authenticate, changePassword);

export default router;
