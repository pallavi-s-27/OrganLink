import { Router } from 'express';
import { body } from 'express-validator';
import { registerDonorInterest, registerRecipientInterest } from '../controllers/publicController.js';

const router = Router();

router.post(
  '/donors',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').trim().notEmpty().withMessage('Phone number required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('bloodGroup').trim().notEmpty().withMessage('Blood group is required'),
    body('organType').trim().notEmpty().withMessage('Organ type is required'),
    body('consent')
      .custom((value) => value === true || value === 'true')
      .withMessage('Consent is required')
  ],
  registerDonorInterest
);

router.post(
  '/recipients',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').trim().notEmpty().withMessage('Phone number required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('bloodGroup').trim().notEmpty().withMessage('Blood group is required'),
    body('organType').trim().notEmpty().withMessage('Organ type is required'),
    body('urgency')
      .isInt({ min: 1, max: 10 })
      .withMessage('Urgency must be between 1 and 10')
  ],
  registerRecipientInterest
);

export default router;
