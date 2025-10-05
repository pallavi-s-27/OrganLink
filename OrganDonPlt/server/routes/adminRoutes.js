import { Router } from 'express';
import { protect, requireRoles } from '../middleware/auth.js';
import {
	listUsers,
	listLogs,
	listApprovals,
	updateApproval,
	createUserProfile,
	listDonorApplications,
	reviewDonorApplication,
	listRecipientApplications,
	reviewRecipientApplication
} from '../controllers/adminController.js';

const router = Router();

router.use(protect, requireRoles('admin', 'doctor'));

router.get('/users', listUsers);
router.post('/users', requireRoles('admin'), createUserProfile);
router.get('/logs', listLogs);
router.get('/approvals', listApprovals);
router.patch('/approvals/:id', updateApproval);
router.get('/applications/donors', requireRoles('admin'), listDonorApplications);
router.patch('/applications/donors/:id', requireRoles('admin'), reviewDonorApplication);
router.get('/applications/recipients', requireRoles('admin'), listRecipientApplications);
router.patch('/applications/recipients/:id', requireRoles('admin'), reviewRecipientApplication);

export default router;
