import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post('/login', authController.login);
router.get('/me', authController.me);
router.post('/logout', authController.logout);

export default router;
