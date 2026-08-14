import { Router } from 'express';
import { experienceController } from '../controllers/experienceController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../handlers/asyncHandler.js';

const router = Router();

// Reads are public so the portfolio can render without signing in.
router.get('/', asyncHandler(experienceController.list));
router.post('/', requireAuth, asyncHandler(experienceController.create));
router.put('/:id', requireAuth, asyncHandler(experienceController.update));
router.delete('/:id', requireAuth, asyncHandler(experienceController.remove));

export default router;
