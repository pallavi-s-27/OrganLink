import { validationResult } from 'express-validator';
import OrganRequest from '../models/OrganRequest.js';
import Donation from '../models/Donation.js';
import Approval from '../models/Approval.js';
import { createAuditLog } from '../utils/audit.js';

const enrichRequest = (requestDoc) => {
  const request =
    typeof requestDoc.toObject === 'function'
      ? requestDoc.toObject({ virtuals: true })
      : requestDoc;

  return {
    id: request._id,
    organType: request.organType,
    hospital: request.hospital,
    urgency: request.urgency,
    urgencyLabel: request.urgencyLabel,
    status: request.status,
    donorName: request.donor?.name ?? 'Pending assignment',
    recipientName: request.recipient?.name ?? 'N/A',
    requesterName: request.requestedBy?.name ?? 'Unknown',
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  };
};

export const listRequests = async (req, res) => {
  const requests = await OrganRequest.find()
    .populate('donor', 'name')
    .populate('recipient', 'name')
    .populate('requestedBy', 'name')
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });
  res.json(requests.map(enrichRequest));
};

export const createRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }

  const recipientId = req.body.recipientId || req.user._id;

  const organRequest = await OrganRequest.create({
    organType: req.body.organType,
    urgency: req.body.urgency,
    notes: req.body.notes,
    hospital: req.body.hospital,
    recipient: recipientId,
    requestedBy: req.user._id,
    status: 'pending'
  });

  await organRequest.populate([
    { path: 'recipient', select: 'name bloodGroup organType' },
    { path: 'requestedBy', select: 'name' }
  ]);

  await Approval.create({
    organRequest: organRequest._id,
    organType: organRequest.organType,
    recipientName: organRequest.recipient?.name,
    donorName: 'Pending',
    requestedBy: organRequest.requestedBy?.name
  });

  await createAuditLog({
    action: 'organ_request.created',
    actor: req.user,
    entity: { type: 'organ_request', id: organRequest._id.toString() },
    metadata: {
      organType: organRequest.organType,
      urgency: organRequest.urgency
    }
  });

  res.status(201).json(enrichRequest(organRequest));
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const organRequest = await OrganRequest.findById(req.params.id);
  if (!organRequest) {
    return res.status(404).json({ message: 'Request not found' });
  }

  organRequest.status = status;
  await organRequest.save();

  await createAuditLog({
    action: 'organ_request.status_changed',
    actor: req.user,
    entity: { type: 'organ_request', id: organRequest._id.toString() },
    metadata: { status }
  });

  res.json(organRequest);
};

export const assignDonation = async (req, res) => {
  const { donationId } = req.body;
  const organRequest = await OrganRequest.findById(req.params.id);
  if (!organRequest) {
    return res.status(404).json({ message: 'Request not found' });
  }
  const donation = await Donation.findById(donationId).populate('donor');
  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  organRequest.donor = donation.donor._id;
  organRequest.status = 'approved';
  organRequest.matchScore = 0.92;
  await organRequest.save();

  donation.status = 'allocated';
  await donation.save();

  await createAuditLog({
    action: 'organ_request.assigned',
    actor: req.user,
    entity: { type: 'organ_request', id: organRequest._id.toString() },
    metadata: { donationId }
  });

  await Approval.findOneAndUpdate(
    { organRequest: organRequest._id },
    { donorName: donation.donor?.name ?? 'Assigned', status: 'pending' }
  );

  res.json(enrichRequest(await organRequest.populate('donor', 'name').populate('recipient', 'name')));
};
