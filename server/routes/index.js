import { Router } from 'express';
import authRoutes from './authRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import projectRoutes from './projectRoutes.js';
import messageRoutes from './messageRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/experience', experienceRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingsRoutes);
router.use('/upload', uploadRoutes);

export default router;
