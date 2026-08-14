import { Router } from 'express';
import { projectController } from '../controllers/projectController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../handlers/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(projectController.list));
router.post('/', requireAuth, asyncHandler(projectController.create));
router.put('/:id', requireAuth, asyncHandler(projectController.update));
router.delete('/:id', requireAuth, asyncHandler(projectController.remove));

export default router;
