import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import complaintService from '../../services/complaint.service';
import { formatDate, getStatusColor, getPriorityColor, sortByPriority } from '../../utils/helpers';
import { staggerContainer, staggerItem } from '../../utils/animations';
import { useToast } from '../../components/ui/Toast';

const StaffDashboard = ({ user }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolutionNotes, setResolutionNotes] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({});

    // Fetch assigned complaints
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await complaintService.getComplaints();
                setComplaints(sortByPriority(data));
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
                addToast('Failed to load complaints', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const handleStatusUpdate = async (complaintId) => {
        try {
            const status = selectedStatus[complaintId];
            const notes = resolutionNotes[complaintId] || '';
            await complaintService.updateStatus(complaintId, status, notes);
            addToast('Status updated successfully!', 'success');
            // Refresh complaints
            const updatedComplaints = await complaintService.getComplaints();
            setComplaints(sortByPriority(updatedComplaints));
        } catch (error) {
            addToast('Failed to update status', 'error');
        }
    };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold gradient-text mb-2">My Assigned Tasks</h1>
                <p className="text-lg text-gray-600">Manage and resolve assigned complaints</p>
            </motion.div>

            {/* Stats */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
                {[
                    { label: 'Total Assigned', value: stats.total, gradient: 'from-purple-500 to-violet-600' },
                    { label: 'Pending', value: stats.pending, gradient: 'from-violet-600 to-purple-600' },
                    { label: 'In Progress', value: stats.inProgress, gradient: 'from-purple-600 to-violet-500' },
                    { label: 'Resolved', value: stats.resolved, gradient: 'from-violet-500 to-purple-600' },
                ].map((stat, index) => (
                    <motion.div key={stat.label} variants={staggerItem}>
                        <Card effect3d glow className="p-6 bg-white/5 border border-purple-500/25">
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
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Complaints List */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-4"
            >
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-400/30 border-t-primary-500"></div>
                    </div>
                ) : complaints.length > 0 ? (
                    complaints.map((complaint) => (
                        <motion.div key={complaint.id} variants={staggerItem}>
                            <Card className="p-6 border border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_22px_rgba(147,51,234,0.35)] transition-all duration-300">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                    {/* Complaint Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {complaint.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {complaint.description}
                                                </p>
                                            </div>
                                            <Badge variant={getPriorityColor(complaint.priority)} className="capitalize flex-shrink-0">
                                                {complaint.priority}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span>ID: #{complaint.id?.slice(-6)}</span>
                                            <span className="capitalize">{complaint.category}</span>
                                            <span>{formatDate(complaint.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="w-full lg:w-80 space-y-3 bg-white/5 border border-purple-500/20 rounded-xl p-3">
                                        <Select
                                            label="Update Status"
                                            options={[
                                                { value: 'pending', label: 'Pending' },
                                                { value: 'in-progress', label: 'In Progress' },
                                                { value: 'resolved', label: 'Resolved' },
                                            ]}
                                            value={selectedStatus[complaint.id] || complaint.status}
                                             onChange={(e) => setSelectedStatus({ ...selectedStatus, [complaint.id]: e.target.value })}
                                        />

                                        {(selectedStatus[complaint.id] === 'resolved' || complaint.status === 'resolved') && (
                                            <Textarea
                                                label="Resolution Notes"
                                                placeholder="Describe how the issue was resolved..."
                                                rows={3}
                                                value={resolutionNotes[complaint.id] || complaint.resolution_notes || ''}
                                                onChange={(e) => setResolutionNotes({ ...resolutionNotes, [complaint.id]: e.target.value })}
                                            />
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                gradient
                                                onClick={() => handleStatusUpdate(complaint.id)}
                                                className="flex-1"
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/staff/tasks/${complaint.id}`)}
                                            >
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Indicator */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${complaint.status === 'resolved' ? 'bg-success w-full' :
                                                    complaint.status === 'in-progress' ? 'bg-purple-400 w-2/3' :
                                                        'bg-amber-400 w-1/3'
                                                    }`}
                                            />
                                        </div>
                                        <Badge variant={getStatusColor(complaint.status)}>
                                            {complaint.status.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                ) : (
                    <Card className="p-12 text-center border border-purple-500/20">
                        <FiCheckCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Assigned</h3>
                        <p className="text-gray-600">You don't have any assigned complaints at the moment.</p>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

export default StaffDashboard;
