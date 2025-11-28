import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  getStats,
  getStudents,
  updateStudentStatus,
  deleteStudent,
  resetStudentPassword,
  getAllProjects,
  updateProjectStatus,
  updateProjectByAdmin,
  deleteProjectByAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/stats', getStats);
router.get('/students', getStudents);
router.patch('/students/:id/status', updateStudentStatus);
router.delete('/students/:id', deleteStudent);
router.post('/students/:id/reset-password', resetStudentPassword);

router.get('/projects', getAllProjects);
router.patch('/projects/:id/status', updateProjectStatus);
router.patch('/projects/:id', updateProjectByAdmin);
router.delete('/projects/:id', deleteProjectByAdmin);

export default router;
