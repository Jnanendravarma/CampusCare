import { supabaseAdmin as supabase } from '../config/supabase.js';
// All queries use supabaseAdmin — backend uses custom JWTs,
// not Supabase sessions, so RLS auth.uid() is never set server-side.

// Helper: fetch user info by id (returns null if not found)
const fetchUser = async (id) => {
    if (!id) return null;
    const { data } = await supabase
        .from('users')
        .select('id, name, email, avatar')
        .eq('id', id)
        .single();
    return data || null;
};

// Helper: enrich a complaint row with user + assigned_staff objects
const enrichComplaint = async (complaint) => {
    const [user, assigned_staff] = await Promise.all([
        fetchUser(complaint.user_id),
        fetchUser(complaint.assigned_to)
    ]);
    return { ...complaint, user, assigned_staff };
};

// @desc    Get all complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
export const getComplaints = async (req, res) => {
    try {
        let query = supabase.from('complaints').select('*');

        if (req.user.role === 'student') {
            query = query.eq('user_id', req.user.id);
        } else if (req.user.role === 'staff') {
            query = query.eq('assigned_to', req.user.id);
        }
        // Admin sees all

        const { data: complaints, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        const enriched = await Promise.all(complaints.map(enrichComplaint));

        res.json({ success: true, count: enriched.length, complaints: enriched });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaint = async (req, res) => {
    try {
        const { data: complaint, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization check
        if (req.user.role === 'student' && complaint.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (req.user.role === 'staff' && complaint.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const enriched = await enrichComplaint(complaint);
        res.json({ success: true, complaint: enriched });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student)
export const createComplaint = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;

        const { data: complaint, error } = await supabase
            .from('complaints')
            .insert([{
                title,
                description,
                category,
                priority: priority || 'medium',
                user_id: req.user.id,
                status: 'pending'
            }])
            .select('*')
            .single();

        if (error) throw error;

        const enriched = await enrichComplaint(complaint);
        res.status(201).json({ success: true, complaint: enriched });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
export const updateComplaint = async (req, res) => {
    try {
        const { data: existing, error: fetchError } = await supabase
            .from('complaints')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role === 'student' && existing.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { data: complaint, error } = await supabase
            .from('complaints')
            .update(req.body)
            .eq('id', req.params.id)
            .select('*')
            .single();

        if (error) throw error;

        const enriched = await enrichComplaint(complaint);
        res.json({ success: true, complaint: enriched });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin or Owner)
export const deleteComplaint = async (req, res) => {
    try {
        const { data: complaint, error: fetchError } = await supabase
            .from('complaints')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role !== 'admin' && complaint.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { error } = await supabase
            .from('complaints')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ success: true, message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign complaint to staff
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
export const assignComplaint = async (req, res) => {
    try {
        const { staffId } = req.body;

        const { data: complaint, error: fetchError } = await supabase
            .from('complaints')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        const { data: staff, error: staffError } = await supabase
            .from('users')
            .select('*')
            .eq('id', staffId)
            .single();

        if (staffError || !staff || staff.role !== 'staff') {
            return res.status(400).json({ message: 'Invalid staff member' });
        }

        const currentTimeline = complaint.timeline || [];
        const newTimelineEntry = {
            status: 'in-progress',
            timestamp: new Date().toISOString(),
            note: `Assigned to ${staff.name}`,
            updated_by: req.user.id
        };

        const { data: updated, error } = await supabase
            .from('complaints')
            .update({
                assigned_to: staffId,
                status: 'in-progress',
                timeline: [...currentTimeline, newTimelineEntry]
            })
            .eq('id', req.params.id)
            .select('*')
            .single();

        if (error) throw error;

        const enriched = await enrichComplaint(updated);
        res.json({ success: true, complaint: enriched });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Staff/Admin)
export const updateStatus = async (req, res) => {
    try {
        const { status, resolutionNotes } = req.body;

        const { data: complaint, error: fetchError } = await supabase
            .from('complaints')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (req.user.role === 'staff' && complaint.assigned_to !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const currentTimeline = complaint.timeline || [];
        const newTimelineEntry = {
            status,
            timestamp: new Date().toISOString(),
            note: status === 'resolved' ? 'Complaint resolved' : `Status updated to ${status}`,
            updated_by: req.user.id
        };

        const updateData = {
            status,
            timeline: [...currentTimeline, newTimelineEntry]
        };

        if (resolutionNotes) {
            updateData.resolution_notes = resolutionNotes;
        }

        const { data: updated, error } = await supabase
            .from('complaints')
            .update(updateData)
            .eq('id', req.params.id)
            .select('*')
            .single();

        if (error) throw error;

        const enriched = await enrichComplaint(updated);
        res.json({ success: true, complaint: enriched });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
