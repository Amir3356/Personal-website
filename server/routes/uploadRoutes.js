import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post('/', requireAuth, uploadController.single);

export default router;
