import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { listShipments } from '../controllers/trackingController.js';

const router = Router();

router.get('/shipments', protect, listShipments);

export default router;
