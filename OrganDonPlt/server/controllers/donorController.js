import { validationResult } from 'express-validator';
import Donation from '../models/Donation.js';
import { createAuditLog } from '../utils/audit.js';

export const listDonations = async (req, res) => {
  const donations = await Donation.find().populate('donor', 'name bloodGroup organType').sort({ createdAt: -1 });
  res.json(donations.map((donation) => ({
    id: donation._id,
    organType: donation.organType,
    donorName: donation.donor?.name,
    bloodGroup: donation.donor?.bloodGroup,
    hospital: donation.hospital,
    status: donation.status,
    createdAt: donation.createdAt
  })));
};

export const shareAvailability = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }

  const donation = await Donation.create({
    donor: req.user._id,
    ...req.body
  });

  await donation.populate('donor', 'name bloodGroup organType');

  await createAuditLog({
    action: 'donation.shared',
    actor: req.user,
    entity: { type: 'donation', id: donation._id.toString() },
    metadata: {
      organType: donation.organType,
      hospital: donation.hospital
    }
  });

  res.status(201).json({
    id: donation._id,
    organType: donation.organType,
    donorName: donation.donor?.name,
    hospital: donation.hospital,
    status: donation.status
  });
};
