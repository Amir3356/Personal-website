import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { asyncHandler } from '../handlers/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(settingsController.get));
router.put('/hero', requireAuth, asyncHandler(settingsController.updateHero));
router.put('/experience', requireAuth, asyncHandler(settingsController.updateExperience));
router.put('/contact', requireAuth, asyncHandler(settingsController.updateContact));

export default router;
