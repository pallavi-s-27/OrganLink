import crypto from 'crypto';
import User from '../models/User.js';
import Approval from '../models/Approval.js';
import OrganRequest from '../models/OrganRequest.js';
import DonorApplication from '../models/DonorApplication.js';
import RecipientApplication from '../models/RecipientApplication.js';
import { fetchRecentLogs, createAuditLog } from '../utils/audit.js';

const generateTempPassword = () => crypto.randomBytes(4).toString('hex');

const mapReviewer = (reviewer) =>
  reviewer
    ? {
        id: reviewer._id,
        name: reviewer.name,
        email: reviewer.email,
        role: reviewer.role
      }
    : null;

const mapDonorApplication = (application) => ({
  id: application._id,
  name: application.name,
  email: application.email,
  phone: application.phone,
  city: application.city,
  country: application.country,
  bloodGroup: application.bloodGroup,
  organType: application.organType,
  preferredHospital: application.preferredHospital,
  availability: application.availability,
  status: application.status,
  submittedAt: application.createdAt,
  reviewedAt: application.reviewedAt,
  reviewedBy: mapReviewer(application.reviewedBy),
  reviewNotes: application.reviewNotes,
  approvedUser: application.approvedUser ? application.approvedUser.toString() : null
});

const mapRecipientApplication = (application) => ({
  id: application._id,
  name: application.name,
  email: application.email,
  phone: application.phone,
  city: application.city,
  country: application.country,
  bloodGroup: application.bloodGroup,
  organType: application.organType,
  urgency: application.urgency,
  hospital: application.hospital,
  diagnosis: application.diagnosis,
  notes: application.notes,
  status: application.status,
  submittedAt: application.createdAt,
  reviewedAt: application.reviewedAt,
  reviewedBy: mapReviewer(application.reviewedBy),
  reviewNotes: application.reviewNotes,
  approvedUser: application.approvedUser ? application.approvedUser.toString() : null
});

const ensureUserForApplication = async (application, role) => {
  let tempPassword;
  let user = application.approvedUser ? await User.findById(application.approvedUser) : null;

  if (!user) {
    user = await User.findOne({ email: application.email });
  }

  if (!user) {
    tempPassword = generateTempPassword();
    user = await User.create({
      name: application.name,
      email: application.email,
      password: tempPassword,
      role,
      phone: application.phone,
      organization: application.preferredHospital || application.hospital,
      city: application.city,
      country: application.country,
      bloodGroup: application.bloodGroup,
      organType: application.organType,
      urgency: role === 'recipient' ? application.urgency : undefined
    });
  }

  return { user, tempPassword };
};

export const listUsers = async (req, res) => {
  const users = await User.find().select('name email role organization city country createdAt');
  res.json(users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: user.organization,
    city: user.city,
    country: user.country,
    createdAt: user.createdAt
  })));
};

export const listLogs = async (req, res) => {
  const logs = await fetchRecentLogs();
  res.json(
    logs.map((log) => ({
      id: log._id,
      action: log.action,
      actor: log.actor?.name ?? 'system',
      entity: log.entity?.type ?? '—',
      createdAt: log.createdAt
    }))
  );
};

export const listApprovals = async (req, res) => {
  const approvals = await Approval.find().sort({ createdAt: -1 }).lean();
  res.json(approvals);
};

export const listDonorApplications = async (req, res) => {
  const applications = await DonorApplication.find()
    .sort({ createdAt: -1 })
    .populate('reviewedBy', 'name email role');

  res.json(applications.map(mapDonorApplication));
};

export const reviewDonorApplication = async (req, res) => {
  const { decision, notes } = req.body;
  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision supplied' });
  }

  const application = await DonorApplication.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (application.status !== 'pending') {
    return res.status(409).json({ message: 'Application has already been reviewed' });
  }

  let credentials;

  if (decision === 'approve') {
    const { user, tempPassword } = await ensureUserForApplication(application, 'donor');
    application.status = 'approved';
    application.approvedUser = user._id;
    if (tempPassword) {
      credentials = { email: user.email, password: tempPassword };
    }
  } else {
    application.status = 'rejected';
    application.approvedUser = undefined;
  }

  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.reviewNotes = notes;

  await application.save();
  await application.populate('reviewedBy', 'name email role');

  await createAuditLog({
    action: decision === 'approve' ? 'admin.donor_application_approved' : 'admin.donor_application_rejected',
    actor: req.user,
    entity: { type: 'donorApplication', id: application._id.toString() },
    metadata: { email: application.email, decision }
  });

  res.json({
    application: mapDonorApplication(application),
    credentials
  });
};

export const listRecipientApplications = async (req, res) => {
  const applications = await RecipientApplication.find()
    .sort({ createdAt: -1 })
    .populate('reviewedBy', 'name email role');

  res.json(applications.map(mapRecipientApplication));
};

export const reviewRecipientApplication = async (req, res) => {
  const { decision, notes } = req.body;
  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision supplied' });
  }

  const application = await RecipientApplication.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (application.status !== 'pending') {
    return res.status(409).json({ message: 'Application has already been reviewed' });
  }

  let credentials;

  if (decision === 'approve') {
    const { user, tempPassword } = await ensureUserForApplication(application, 'recipient');
    application.status = 'approved';
    application.approvedUser = user._id;
    if (tempPassword) {
      credentials = { email: user.email, password: tempPassword };
    }
  } else {
    application.status = 'rejected';
    application.approvedUser = undefined;
  }

  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.reviewNotes = notes;

  await application.save();
  await application.populate('reviewedBy', 'name email role');

  await createAuditLog({
    action:
      decision === 'approve'
        ? 'admin.recipient_application_approved'
        : 'admin.recipient_application_rejected',
    actor: req.user,
    entity: { type: 'recipientApplication', id: application._id.toString() },
    metadata: { email: application.email, decision }
  });

  res.json({
    application: mapRecipientApplication(application),
    credentials
  });
};

export const updateApproval = async (req, res) => {
  const approval = await Approval.findById(req.params.id);
  if (!approval) {
    return res.status(404).json({ message: 'Approval not found' });
  }

  approval.status = req.body.status;
  await approval.save();

  if (req.body.status === 'approved') {
    await OrganRequest.findByIdAndUpdate(approval.organRequest, { status: 'approved' });
  }

  await createAuditLog({
    action: 'approval.updated',
    actor: req.user,
    entity: { type: 'approval', id: approval._id.toString() },
    metadata: { status: req.body.status }
  });

  res.json(approval);
};

export const createUserProfile = async (req, res) => {
  const requiredFields = ['name', 'email', 'password', 'role'];
  const missing = requiredFields.filter((field) => !req.body[field]);

  if (missing.length) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const allowedRoles = ['donor', 'recipient', 'doctor', 'admin'];
  if (!allowedRoles.includes(req.body.role)) {
    return res.status(400).json({ message: 'Invalid role supplied' });
  }

  const existing = await User.findOne({ email: req.body.email });
  if (existing) {
    return res.status(409).json({ message: 'Account already exists for this email' });
  }

  const urgencyValue = Number(req.body.urgency);

  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    phone: req.body.phone,
    organization: req.body.organization,
    city: req.body.city,
    country: req.body.country,
    bloodGroup: req.body.bloodGroup,
    organType: req.body.organType,
    urgency:
      req.body.role === 'recipient' && Number.isFinite(urgencyValue) && !Number.isNaN(urgencyValue)
        ? urgencyValue
        : undefined
  };

  const user = await User.create(payload);

  await createAuditLog({
    action: 'admin.created_user',
    actor: req.user,
    entity: { type: 'user', id: user._id.toString() },
    metadata: { role: user.role }
  });

  res.status(201).json(user.toSafeObject());
};

