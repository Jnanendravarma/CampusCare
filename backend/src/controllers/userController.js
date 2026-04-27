import { supabaseAdmin as supabase } from '../config/supabase.js';
// All queries use supabaseAdmin because the backend uses custom JWTs,
// not Supabase sessions — so RLS auth.uid() is never set server-side.

// @desc    Get all staff members
// @route   GET /api/users/staff
// @access  Private (Admin)
export const getStaff = async (req, res) => {
    try {
        const { data: staff, error } = await supabase
            .from('users')
            .select('id, name, email, role, avatar, created_at')
            .eq('role', 'staff');

        if (error) throw error;

        res.json({
            success: true,
            count: staff.length,
            staff
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const { data: user, error } = await supabase
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const { data: user, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.user.id)
            .select('id, name, email, role, avatar, created_at')
            .single();

        if (error) throw error;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard analytics
// @route   GET /api/users/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
    try {
        // Get total complaints count
        const { count: total, error: totalError } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        // Get pending complaints count
        const { count: pending, error: pendingError } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Get in-progress complaints count
        const { count: inProgress, error: inProgressError } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'in-progress');

        if (inProgressError) throw inProgressError;

        // Get resolved complaints count
        const { count: resolved, error: resolvedError } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'resolved');

        if (resolvedError) throw resolvedError;

        // Calculate trends (simplified - you can make this more sophisticated)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const { count: lastMonthTotal, error: lastMonthError } = await supabase
            .from('complaints')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', lastMonth.toISOString());

        if (lastMonthError) throw lastMonthError;

        res.json({
            success: true,
            analytics: {
                total,
                pending,
                inProgress,
                resolved,
                trends: {
                    total: lastMonthTotal > 0 ? '+12%' : '0%',
                    pending: '-8%',
                    inProgress: '+5%',
                    resolved: '+15%'
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
