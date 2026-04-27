// Date formatting
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Status color mapping
export const getStatusColor = (status) => {
    const colors = {
        pending: 'warning',
        'in-progress': 'in-progress',
        resolved: 'resolved',
        rejected: 'rejected',
    };
    return colors[status] || 'pending';
};

// Priority color mapping
export const getPriorityColor = (priority) => {
    const colors = {
        low: 'low',
        medium: 'medium',
        high: 'high',
    };
    return colors[priority] || 'low';
};

// Sort complaints by priority
export const sortByPriority = (complaints) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return [...complaints].sort((a, b) =>
        priorityOrder[b.priority] - priorityOrder[a.priority]
    );
};

// Filter complaints
export const filterComplaints = (complaints, filters) => {
    return complaints.filter(complaint => {
        if (filters.status && filters.status !== 'all' && complaint.status !== filters.status) {
            return false;
        }
        if (filters.category && filters.category !== 'all' && complaint.category !== filters.category) {
            return false;
        }
        if (filters.priority && filters.priority !== 'all' && complaint.priority !== filters.priority) {
            return false;
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                complaint.title.toLowerCase().includes(searchLower) ||
                complaint.description.toLowerCase().includes(searchLower) ||
                complaint.id.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });
};

// Generate initials from name
export const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Truncate text
export const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
