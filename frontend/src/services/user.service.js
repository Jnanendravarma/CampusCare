import api from './api';

const userService = {
    // Get all staff members (admin only)
    getStaff: async () => {
        const response = await api.get('/users/staff');
        return response.data.staff;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data.user;
    },

    // Update user profile
    updateProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data.user;
    },

    // Get analytics (admin only)
    getAnalytics: async () => {
        const response = await api.get('/users/analytics');
        return response.data.analytics;
    }
};

export default userService;
