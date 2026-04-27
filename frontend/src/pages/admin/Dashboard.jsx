import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiFileText, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import complaintService from '../../services/complaint.service';
import userService from '../../services/user.service';
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/helpers';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { useToast } from '../../components/ui/Toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [complaints, setComplaints] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [assignStaffId, setAssignStaffId] = useState('');

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [complaintsData, staffData] = await Promise.all([
                    complaintService.getComplaints(),
                    userService.getStaff()
                ]);
                setComplaints(complaintsData);
                setStaffMembers(staffData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                addToast('Failed to load data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAssign = async () => {
        try {
            await complaintService.assignComplaint(selectedComplaint.id, assignStaffId);
            addToast('Staff assigned successfully!', 'success');
            const updatedComplaints = await complaintService.getComplaints();
            setComplaints(updatedComplaints);
            setSelectedComplaint(null);
            setAssignStaffId('');
        } catch (error) {
            addToast('Failed to assign staff', 'error');
        }
    };

    const analytics = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
        trends: {
            total: '+0%',
            pending: '+0%',
            inProgress: '+0%',
            resolved: '+0%'
        }
    };

    const analyticsCards = [
        {
            label: 'Total Complaints',
            value: analytics.total,
            trend: analytics.trends.total,
            icon: FiFileText,
            color: 'primary',
        },
        {
            label: 'Pending',
            value: analytics.pending,
            trend: analytics.trends.pending,
            icon: FiClock,
            color: 'warning',
        },
        {
            label: 'In Progress',
            value: analytics.inProgress,
            trend: analytics.trends.inProgress,
            icon: FiAlertCircle,
            color: 'primary',
        },
        {
            label: 'Resolved',
            value: analytics.resolved,
            trend: analytics.trends.resolved,
            icon: FiCheckCircle,
            color: 'success',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
                <p className="text-lg text-gray-600">Manage all complaints and staff assignments</p>
            </motion.div>

            {/* Analytics Cards */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {analyticsCards.map((card, index) => {
                    const Icon = card.icon;
                    const isPositive = card.trend.startsWith('+');
                    const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;

                    // Gradient colors for each card type
                    const gradients = {
                        primary: 'from-purple-500 to-violet-600',
                        warning: 'from-violet-600 to-purple-600',
                        success: 'from-purple-600 to-violet-500',
                    };

                    return (
                        <motion.div key={card.label} variants={staggerItem}>
                            <Card effect3d glow className="p-6 bg-white/5 border border-purple-500/25">
                                <div className="flex items-start justify-between mb-4">
                                    <motion.div
                                        className={`w-14 h-14 bg-gradient-to-br ${gradients[card.color]} rounded-xl flex items-center justify-center shadow-lg`}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <Icon className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full border ${isPositive ? 'bg-green-500/15 text-green-300 border-green-400/40' : 'bg-red-500/15 text-red-300 border-red-400/40'}`}>
                                        <TrendIcon className="w-4 h-4" />
                                        {card.trend}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
                                <motion.p
                                    className="text-4xl font-bold gradient-text"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1, type: "spring" }}
                                >
                                    {card.value}
                                </motion.p>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Complaints Table */}
            <Card className="overflow-hidden border border-purple-500/25">
                <div className="p-6 border-b border-purple-500/20">
                    <h2 className="text-xl font-semibold text-gray-900">All Complaints</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/8 border-b border-purple-500/20">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400/30 border-t-primary-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : complaints.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No complaints found
                                    </td>
                                </tr>
                            ) : (
                                complaints.map((complaint) => {
                                    const user = complaint.user;          // Supabase: enriched user object
                                    const staff = complaint.assigned_staff; // Supabase: enriched staff object

                                    return (
                                        <motion.tr
                                            key={complaint.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ backgroundColor: 'rgba(124,58,237,0.12)' }}
                                            className="transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{complaint.id?.slice(-6)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {user?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                                {complaint.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-2 py-1 bg-white/10 text-[#C4B5FD] border border-purple-500/25 rounded text-xs capitalize">
                                                    {complaint.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={getPriorityColor(complaint.priority)} className="capitalize">
                                                    {complaint.priority}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={getStatusColor(complaint.status)}>
                                                    {complaint.status.replace('-', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {staff?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                                                        className="text-primary-300 hover:text-primary-200 font-medium"
                                                    >
                                                        View
                                                    </button>
                                                    {!complaint.assigned_to && (
                                                        <button
                                                            onClick={() => setSelectedComplaint(complaint)}
                                                            className="text-green-300 hover:text-green-200 font-medium"
                                                        >
                                                            Assign
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assign Staff Modal */}
            <Modal
                isOpen={!!selectedComplaint}
                onClose={() => setSelectedComplaint(null)}
                title="Assign Staff Member"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Assign a staff member to complaint <strong>#{selectedComplaint?.id?.slice(-6)}</strong>
                    </p>
                    <Select
                        label="Select Staff Member"
                        options={staffMembers.map(s => ({ value: s.id, label: s.name }))}
                        value={assignStaffId}
                        onChange={(e) => setAssignStaffId(e.target.value)}
                    />
                    <div className="flex gap-3">
                        <Button onClick={handleAssign} className="flex-1" disabled={!assignStaffId}>
                            Assign
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
