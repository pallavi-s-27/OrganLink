import { validationResult } from 'express-validator';
import DonorApplication from '../models/DonorApplication.js';
import RecipientApplication from '../models/RecipientApplication.js';
import { createAuditLog } from '../utils/audit.js';

export const registerDonorInterest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const application = await DonorApplication.create({
    ...req.body,
    consent: Boolean(req.body.consent)
  });

  await createAuditLog({
    action: 'public.donor_application_submitted',
    entity: { type: 'donorApplication', id: application._id.toString() },
    metadata: {
      email: application.email,
      organType: application.organType,
      bloodGroup: application.bloodGroup
    }
  });

  res.status(201).json({
    message: 'Thank you for registering as a donor. Our coordination team will reach out shortly.',
    applicationId: application._id
  });
};

export const registerRecipientInterest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const application = await RecipientApplication.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city,
    country: req.body.country,
    bloodGroup: req.body.bloodGroup,
    organType: req.body.organType,
    urgency: Number(req.body.urgency),
    hospital: req.body.hospital,
    diagnosis: req.body.diagnosis,
    notes: req.body.notes
  });

  await createAuditLog({
    action: 'public.recipient_application_submitted',
    entity: { type: 'recipientApplication', id: application._id.toString() },
    metadata: {
      email: application.email,
      organType: application.organType,
      urgency: application.urgency
    }
  });

  res.status(201).json({
    message: 'Recipient registration submitted. Our transplant board will review the case shortly.',
    applicationId: application._id
  });
};
