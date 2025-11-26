import express from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  createProject,
  getMyProjects,
  updateMyProject,
  deleteMyProject,
  getApprovedProjects,
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/approved', getApprovedProjects);

router.use(authenticate, requireRole('student'));

router.post('/', createProject);
router.get('/me', getMyProjects);
router.patch('/:id', updateMyProject);
router.delete('/:id', deleteMyProject);

export default router;
