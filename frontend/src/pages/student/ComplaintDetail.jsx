import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiClock, FiTag } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import StatusTimeline from '../../components/complaints/StatusTimeline';
import complaintService from '../../services/complaint.service';
import authService from '../../services/auth.service';
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/helpers';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = authService.getStoredUser();

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setLoading(true);
                const data = await complaintService.getComplaint(id);
                setComplaint(data);
            } catch (err) {
                console.error('Failed to fetch complaint:', err);
                setError(err.response?.data?.message || 'Failed to load complaint');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    const getDashboardPath = () => {
        if (user?.role === 'admin') return '/admin/dashboard';
        if (user?.role === 'staff') return '/staff/dashboard';
        return '/student/dashboard';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-400/30 border-t-primary-500"></div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">{error || 'Complaint not found'}</p>
                <Button onClick={() => navigate(getDashboardPath())} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                icon={<FiArrowLeft />}
                onClick={() => navigate(getDashboardPath())}
            >
                Back to Dashboard
            </Button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{complaint.title}</h1>
                                <Badge variant={getStatusColor(complaint.status)}>
                                    {complaint.status.replace('-', ' ')}
                                </Badge>
                            </div>
                            <p className="text-sm text-[#A78BFA]">Complaint ID: #{complaint.id?.slice(-6)}</p>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-purple-500/20">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiClock className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Submitted</p>
                                <p className="text-sm font-medium">{formatDate(complaint.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiTag className="w-5 h-5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500">Category</p>
                                <p className="text-sm font-medium capitalize">{complaint.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 ${complaint.priority === 'high' ? 'bg-error' :
                                complaint.priority === 'medium' ? 'bg-warning' :
                                    'bg-gray-400'
                                }`} />
                            <div>
                                <p className="text-xs text-gray-500">Priority</p>
                                <p className="text-sm font-medium capitalize">{complaint.priority}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Info (for admin/staff) */}
                    {(user?.role === 'admin' || user?.role === 'staff') && complaint.user && (
                        <div className="mb-6 pb-6 border-b border-purple-500/20">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Student Information</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                                    {complaint.user.avatar || complaint.user.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{complaint.user.name}</p>
                                    <p className="text-sm text-gray-500">{complaint.user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
                    </div>

                    {/* Assigned Staff */}
                    {complaint.assigned_staff && (
                        <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                                    {complaint.assigned_staff.avatar || complaint.assigned_staff.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Assigned to</p>
                                    <p className="font-medium text-gray-900">{complaint.assigned_staff.name}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Timeline */}
            {complaint.timeline && complaint.timeline.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6 md:p-8">
                        <StatusTimeline timeline={complaint.timeline} currentStatus={complaint.status} hasAssigned={Boolean(complaint.assigned_staff)} />
                    </Card>
                </motion.div>
            )}

            {/* Resolution Notes */}
            {complaint.status === 'resolved' && complaint.resolution_notes && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6 md:p-8 bg-green-500/10 border-green-400/30">
                        <h3 className="text-lg font-semibold text-[#E9D5FF] mb-2">Resolution Notes</h3>
                        <p className="text-[#C4B5FD]">{complaint.resolutionNotes}</p>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default ComplaintDetail;

