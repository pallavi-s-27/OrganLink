import { Router } from 'express';
import { listRecipients } from '../controllers/recipientController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, listRecipients);

export default router;
