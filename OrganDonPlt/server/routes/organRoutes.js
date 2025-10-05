import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { requireRoles } from '../middleware/auth.js';
import { createRequest, listRequests, assignDonation, updateStatus } from '../controllers/organController.js';

const router = Router();

router.get('/', protect, listRequests);

router.post(
  '/',
  protect,
  [body('organType').notEmpty(), body('hospital').notEmpty(), body('urgency').isNumeric()],
  createRequest
);

router.patch('/:id/status', protect, requireRoles('doctor', 'admin'), updateStatus);
router.post('/:id/assign', protect, requireRoles('doctor', 'admin'), assignDonation);

export default router;
