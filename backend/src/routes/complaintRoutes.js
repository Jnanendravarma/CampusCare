import express from 'express';
import { body } from 'express-validator';
import {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaint,
    deleteComplaint,
    assignComplaint,
    updateStatus
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const createComplaintValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
    body('category').isIn(['infrastructure', 'maintenance', 'cleanliness', 'safety', 'other']).withMessage('Invalid category'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
];

const updateStatusValidation = [
    body('status').isIn(['pending', 'in-progress', 'resolved', 'rejected']).withMessage('Invalid status'),
    body('resolutionNotes').optional().trim()
];

// Routes
router.route('/')
    .get(protect, getComplaints)
    .post(protect, authorize('student'), createComplaintValidation, validate, createComplaint);

router.route('/:id')
    .get(protect, getComplaint)
    .put(protect, updateComplaint)
    .delete(protect, deleteComplaint);

router.put('/:id/assign', protect, authorize('admin'), assignComplaint);
router.put('/:id/status', protect, authorize('staff', 'admin'), updateStatusValidation, validate, updateStatus);

export default router;
