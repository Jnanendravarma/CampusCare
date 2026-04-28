import jwt from 'jsonwebtoken';
import supabase, { supabaseAdmin } from '../config/supabase.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Use admin.createUser with email_confirm:true so users can login immediately
        // without needing to verify their email (supabase.auth.signUp requires confirmation)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,   // ← skips the confirmation email
        });

        if (authError) {
            return res.status(400).json({ message: authError.message });
        }

        if (!authData.user) {
            return res.status(400).json({ message: 'Failed to create user' });
        }

        // Insert profile row
        const { data: user, error: insertError } = await supabaseAdmin
            .from('users')
            .insert([{
                id: authData.user.id,
                name,
                email,
                role: role || 'student'
            }])
            .select()
            .single();

        if (insertError) {
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return res.status(400).json({ message: insertError.message });
        }

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Sign in with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!authData.user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Step 2: Get user details from users table
        // Use supabaseAdmin — Supabase session exists but we use our own JWT,
        // so RLS auth.uid() won't resolve on the backend.
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, avatar')
            .eq('id', authData.user.id)
            .single();

        if (userError || !user) {
            return res.status(401).json({ message: 'User not found in database' });
        }

        // Generate our own JWT token for the session
        const token = generateToken(user.id);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        // Use supabaseAdmin — backend uses custom JWTs, not Supabase sessions,
        // so RLS auth.uid() is never set on server-side requests.
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, avatar, created_at')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create user profile row after first-time Google OAuth sign-in
// @route   POST /api/auth/google-profile
// @access  Private (Supabase OAuth token)
export const googleProfile = async (req, res) => {
    try {
        const { id, name, email, avatar } = req.body;

        // Check if profile already exists
        const { data: existing } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, avatar')
            .eq('id', req.user.id)
            .single();

        if (existing) {
            // Already exists — just return it
            return res.json({ success: true, user: existing });
        }

        // Create new profile row
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .insert([{
                id: req.user.id,
                name: name || email.split('@')[0],
                email,
                role: 'student',
                avatar: avatar || null
            }])
            .select('id, name, email, role, avatar')
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
