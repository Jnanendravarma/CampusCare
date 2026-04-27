// Mock Users
export const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'staff', avatar: 'MJ' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'staff', avatar: 'SW' },
    { id: 5, name: 'Admin User', email: 'admin@example.com', role: 'admin', avatar: 'AU' },
];

// Categories - must match DB constraint: ('infrastructure', 'maintenance', 'cleanliness', 'safety', 'other')
export const categories = [
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'safety', label: 'Safety' },
    { value: 'other', label: 'Other' },
];

// Priority Levels - must match DB constraint: ('low', 'medium', 'high', 'urgent')
export const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

// Status Options
export const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
];

// Mock Complaints
export const mockComplaints = [
    {
        id: 'CMP001',
        title: 'Broken Light in Room 204',
        description: 'The ceiling light in room 204 has stopped working. Need immediate replacement.',
        category: 'electrical',
        priority: 'high',
        status: 'in-progress',
        userId: 1,
        assignedTo: 3,
        createdAt: '2026-01-15T10:30:00',
        updatedAt: '2026-01-16T14:20:00',
        resolvedAt: null,
        resolutionNotes: '',
        timeline: [
            { status: 'pending', timestamp: '2026-01-15T10:30:00', note: 'Complaint submitted' },
            { status: 'in-progress', timestamp: '2026-01-16T14:20:00', note: 'Assigned to Mike Johnson' },
        ],
    },
    {
        id: 'CMP002',
        title: 'Leaking Tap in Washroom',
        description: 'Water is continuously dripping from the tap in the ground floor washroom.',
        category: 'plumbing',
        priority: 'medium',
        status: 'resolved',
        userId: 2,
        assignedTo: 4,
        createdAt: '2026-01-14T09:15:00',
        updatedAt: '2026-01-17T11:30:00',
        resolvedAt: '2026-01-17T11:30:00',
        resolutionNotes: 'Replaced the faulty tap washer. Issue resolved.',
        timeline: [
            { status: 'pending', timestamp: '2026-01-14T09:15:00', note: 'Complaint submitted' },
            { status: 'in-progress', timestamp: '2026-01-15T08:00:00', note: 'Assigned to Sarah Williams' },
            { status: 'resolved', timestamp: '2026-01-17T11:30:00', note: 'Tap repaired successfully' },
        ],
    },
    {
        id: 'CMP003',
        title: 'Dirty Corridor on 3rd Floor',
        description: 'The corridor on the 3rd floor needs cleaning. There is dust and debris.',
        category: 'cleaning',
        priority: 'low',
        status: 'pending',
        userId: 1,
        assignedTo: null,
        createdAt: '2026-01-18T16:45:00',
        updatedAt: '2026-01-18T16:45:00',
        resolvedAt: null,
        resolutionNotes: '',
        timeline: [
            { status: 'pending', timestamp: '2026-01-18T16:45:00', note: 'Complaint submitted' },
        ],
    },
    {
        id: 'CMP004',
        title: 'Cracked Wall in Lobby',
        description: 'There is a visible crack on the wall near the main entrance lobby.',
        category: 'infrastructure',
        priority: 'high',
        status: 'pending',
        userId: 2,
        assignedTo: null,
        createdAt: '2026-01-19T08:00:00',
        updatedAt: '2026-01-19T08:00:00',
        resolvedAt: null,
        resolutionNotes: '',
        timeline: [
            { status: 'pending', timestamp: '2026-01-19T08:00:00', note: 'Complaint submitted' },
        ],
    },
    {
        id: 'CMP005',
        title: 'AC Not Working in Library',
        description: 'The air conditioning system in the library is not functioning properly.',
        category: 'electrical',
        priority: 'medium',
        status: 'in-progress',
        userId: 1,
        assignedTo: 3,
        createdAt: '2026-01-17T13:20:00',
        updatedAt: '2026-01-18T10:15:00',
        resolvedAt: null,
        resolutionNotes: '',
        timeline: [
            { status: 'pending', timestamp: '2026-01-17T13:20:00', note: 'Complaint submitted' },
            { status: 'in-progress', timestamp: '2026-01-18T10:15:00', note: 'Assigned to Mike Johnson' },
        ],
    },
];

// Get user by ID
export const getUserById = (id) => mockUsers.find(user => user.id === id);

// Get complaints by user
export const getComplaintsByUser = (userId) =>
    mockComplaints.filter(complaint => complaint.userId === userId);

// Get complaints by staff
export const getComplaintsByStaff = (staffId) =>
    mockComplaints.filter(complaint => complaint.assignedTo === staffId);

// Get staff members
export const getStaffMembers = () => mockUsers.filter(user => user.role === 'staff');

// Analytics data
export const getAnalytics = () => {
    const total = mockComplaints.length;
    const pending = mockComplaints.filter(c => c.status === 'pending').length;
    const inProgress = mockComplaints.filter(c => c.status === 'in-progress').length;
    const resolved = mockComplaints.filter(c => c.status === 'resolved').length;

    return {
        total,
        pending,
        inProgress,
        resolved,
        trends: {
            total: '+12%',
            pending: '-8%',
            inProgress: '+5%',
            resolved: '+15%',
        }
    };
};
