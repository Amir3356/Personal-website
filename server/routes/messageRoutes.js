import { Router } from 'express';
import { messageController } from '../controllers/messageController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../handlers/asyncHandler.js';

const router = Router();

// Public: anyone submitting the portfolio contact form.
router.post('/', asyncHandler(messageController.create));

// Reading and managing messages is admin-only.
router.get('/', requireAuth, asyncHandler(messageController.list));
router.patch('/:id', requireAuth, asyncHandler(messageController.setRead));
router.delete('/:id', requireAuth, asyncHandler(messageController.remove));

export default router;
