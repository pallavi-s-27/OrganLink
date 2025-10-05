import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { createAuditLog } from '../utils/audit.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Account already exists for this email' });
  }

  const user = await User.create(req.body);
  const token = generateToken(user._id);

  await createAuditLog({
    action: 'user.registered',
    actor: user,
    entity: { type: 'user', id: user._id.toString() }
  });

  res.status(201).json({ user: user.toSafeObject(), token });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user._id);

  await createAuditLog({
    action: 'user.logged_in',
    actor: user,
    entity: { type: 'user', id: user._id.toString() }
  });

  res.json({ user: user.toSafeObject(), token });
};

export const currentUser = async (req, res) => {
  res.json(req.user.toSafeObject());
};
