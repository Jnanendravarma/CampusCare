import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Strategy 1: Try our own JWT first (email/password login)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, avatar, created_at')
            .eq('id', decoded.id)
            .single();

        if (!error && user) {
            req.user = user;
            return next();
        }
    } catch {
        // Not our JWT — fall through and try Supabase token
    }

    // Strategy 2: Supabase OAuth access_token (Google sign-in)
    try {
        const { data: { user: supabaseUser }, error: supabaseError } = await supabaseAdmin.auth.getUser(token);

        if (supabaseError || !supabaseUser) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }

        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, name, email, role, avatar, created_at')
            .eq('id', supabaseUser.id)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: 'User profile not found' });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// Lightweight middleware for routes that need a valid Supabase token
// but DON'T require an existing users table row (e.g. /google-profile).
export const protectSupabase = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) return res.status(401).json({ message: 'Invalid Supabase token' });
        // Attach Supabase user directly — no users table lookup needed
        req.user = { id: user.id, email: user.email };
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token verification failed' });
    }
};
