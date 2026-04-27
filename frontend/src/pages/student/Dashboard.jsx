import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiFilter } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/complaints/EmptyState';
import complaintService from '../../services/complaint.service';
import { filterComplaints } from '../../utils/helpers';
import { staggerContainer, staggerItem } from '../../utils/animations';

const StudentDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
    });
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch complaints from API
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await complaintService.getComplaints();
                setComplaints(data);
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const filteredComplaints = filterComplaints(complaints, filters);

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                className="bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {user?.avatar && user.avatar.startsWith('http') ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shadow-lg flex-shrink-0"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white/30 flex-shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                    )}
                    {/* Text */}
                    <div>
                        <p className="text-white/80 text-sm font-medium">{getGreeting()} 👋</p>
                        <h2 className="text-2xl font-bold text-white">{user?.name || 'Student'}</h2>
                        <p className="text-white/70 text-sm mt-0.5">Welcome to your CampusCare dashboard</p>
                    </div>
                </div>
            </motion.div>

            {/* Header */}
            <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">My Complaints</h1>
                    <p className="text-lg text-gray-600">Track and manage your maintenance requests</p>
                </div>
                <Button
                    icon={<FiPlus />}
                    size="lg"
                    gradient
                    glow
                    onClick={() => navigate('/student/raise-complaint')}
                >
                    Raise New Complaint
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
                {[
                    { label: 'Total', value: stats.total, gradient: 'from-purple-500 to-violet-600' },
                    { label: 'Pending', value: stats.pending, gradient: 'from-violet-500 to-purple-600' },
                    { label: 'In Progress', value: stats.inProgress, gradient: 'from-purple-600 to-violet-500' },
                    { label: 'Resolved', value: stats.resolved, gradient: 'from-violet-600 to-purple-500' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        variants={staggerItem}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-soft hover:shadow-[0_0_25px_rgba(147,51,234,0.45)] p-6 border border-purple-500/25 card-3d cursor-pointer"
                    >
                        <p className="text-sm font-medium text-gray-600 mb-3">{stat.label}</p>
                        <motion.p
                            className="text-4xl font-bold gradient-text"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, type: "spring" }}
                        >
                            {stat.value}
                        </motion.p>
                        <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${stat.gradient} opacity-60`}></div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters */}
            <motion.div
                className="glass rounded-2xl shadow-soft p-5 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
                    <FiFilter className="text-primary-300 w-5 h-5" />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2.5 min-w-[12rem] border border-purple-500/35 rounded-xl text-sm font-medium focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all bg-white/10 hover:border-primary-300"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="px-4 py-2.5 min-w-[12rem] border border-purple-500/35 rounded-xl text-sm font-medium focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all bg-white/10 hover:border-primary-300"
                    >
                        <option value="all">All Categories</option>
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </motion.div>

            {/* Complaints Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-400/30 border-t-primary-500"></div>
                </div>
            ) : filteredComplaints.length > 0 ? (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredComplaints.map((complaint) => (
                        <motion.div key={complaint.id} variants={staggerItem}>
                            <div className="bg-white/5 backdrop-blur-lg rounded-xl shadow-soft hover:shadow-[0_0_24px_rgba(147,51,234,0.42)] hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-purple-500/20 hover:border-purple-400/50">
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{complaint.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${complaint.status === 'pending' ? 'bg-amber-500/15 text-amber-300 border-amber-400/40' :
                                            complaint.status === 'in-progress' ? 'bg-purple-500/20 text-purple-200 border-purple-400/45' :
                                                'bg-green-500/15 text-green-300 border-green-400/40'
                                            }`}>
                                            {complaint.status.replace('-', ' ')}
                                        </span>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                                        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 bg-white/10 text-[#C4B5FD] rounded-md text-xs font-medium capitalize border border-purple-500/20">
                                                {complaint.category}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border ${complaint.priority === 'high' ? 'bg-error/10 text-error border-error/40' :
                                                complaint.priority === 'medium' ? 'bg-warning/10 text-warning border-warning/40' :
                                                    'bg-white/10 text-[#C4B5FD] border-purple-500/25'
                                                }`}>
                                                {complaint.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {complaint.status === 'pending' && (
                                                <button
                                                    onClick={() => navigate(`/student/complaints/${complaint.id}/edit`)}
                                                    className="text-xs font-medium text-primary-300 hover:text-primary-200 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/student/complaints/${complaint.id}`)}
                                                className="text-xs font-medium text-primary-300 hover:text-primary-200 transition-colors"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <EmptyState
                    title="No complaints found"
                    description="You haven't raised any complaints yet. Click the button above to submit your first complaint."
                    actionLabel="Raise Complaint"
                    onAction={() => navigate('/student/raise-complaint')}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
