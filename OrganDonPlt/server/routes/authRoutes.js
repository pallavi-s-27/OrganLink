import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, currentUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['donor', 'recipient', 'doctor', 'admin'])
  ],
  register
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);

router.get('/me', protect, currentUser);

export default router;
