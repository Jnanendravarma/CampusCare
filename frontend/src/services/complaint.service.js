import api from './api';

const complaintService = {
    // Get all complaints (filtered by role on backend)
    getComplaints: async () => {
        const response = await api.get('/complaints');
        return response.data.complaints;
    },

    // Get single complaint
    getComplaint: async (id) => {
        const response = await api.get(`/complaints/${id}`);
        return response.data.complaint;
    },

    // Create new complaint
    createComplaint: async (complaintData) => {
        const response = await api.post('/complaints', complaintData);
        return response.data.complaint;
    },

    // Update complaint
    updateComplaint: async (id, complaintData) => {
        const response = await api.put(`/complaints/${id}`, complaintData);
        return response.data.complaint;
    },

    // Delete complaint
    deleteComplaint: async (id) => {
        const response = await api.delete(`/complaints/${id}`);
        return response.data;
    },

    // Assign complaint to staff (admin only)
    assignComplaint: async (id, staffId) => {
        const response = await api.put(`/complaints/${id}/assign`, { staffId });
        return response.data.complaint;
    },

    // Update complaint status (staff/admin)
    updateStatus: async (id, status, resolutionNotes = '') => {
        const response = await api.put(`/complaints/${id}/status`, { status, resolutionNotes });
        return response.data.complaint;
    }
};

export default complaintService;

