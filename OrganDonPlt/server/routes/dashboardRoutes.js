import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getOverview } from '../controllers/dashboardController.js';

const router = Router();

router.get('/overview', protect, getOverview);

export default router;
