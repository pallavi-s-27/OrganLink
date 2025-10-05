import { Router } from 'express';
import { body } from 'express-validator';
import { listDonations, shareAvailability } from '../controllers/donorController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, listDonations);

router.post(
  '/availability',
  protect,
  [body('organType').notEmpty(), body('hospital').notEmpty(), body('preservationHours').isNumeric()],
  shareAvailability
);

export default router;
