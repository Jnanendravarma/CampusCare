import express from 'express';
import { getStaff, getProfile, updateProfile, getAnalytics } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/staff', protect, authorize('admin'), getStaff);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

export default router;
