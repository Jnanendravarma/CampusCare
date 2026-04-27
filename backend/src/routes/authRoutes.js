import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, googleProfile } from '../controllers/authController.js';
import { protect, protectSupabase } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['student', 'staff', 'admin']).withMessage('Invalid role')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);

// Called by frontend after Google OAuth sign-in
// Uses protectSupabase (no users table row required) so new users can create their profile
router.post('/google-profile', protectSupabase, googleProfile);

// Google OAuth is handled entirely by Supabase on the frontend
// No backend routes needed

export default router;
