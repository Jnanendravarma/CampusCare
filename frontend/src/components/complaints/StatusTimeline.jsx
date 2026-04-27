import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiTool, FiFileText } from 'react-icons/fi';
import { formatDateTime } from '../../utils/helpers';

const StatusTimeline = ({ timeline, currentStatus, hasAssigned }) => {
    const statusSteps = [
        { key: 'created', label: 'Created', icon: FiFileText },
        { key: 'assigned', label: 'Assigned', icon: FiClock },
        { key: 'in-progress', label: 'In Progress', icon: FiTool },
        { key: 'resolved', label: 'Resolved', icon: FiCheckCircle },
    ];

    const normalizedStatus = currentStatus === 'pending' ? 'created' : currentStatus;

    const getStepStatus = (stepKey) => {
        const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
        const currentIndex = statusSteps.findIndex(s => s.key === normalizedStatus);

        if (stepKey === 'assigned' && !hasAssigned && normalizedStatus === 'created') {
            return 'pending';
        }

        if (stepKey === 'assigned' && hasAssigned && normalizedStatus === 'created') {
            return 'completed';
        }

        if (stepIndex <= currentIndex) return 'completed';
        if (stepIndex === currentIndex + 1) return 'current';
        return 'pending';
    };

    return (
        <div className="py-6">
            <h3 className="text-lg font-semibold text-[#E9D5FF] mb-6">Status Timeline</h3>

            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/70 via-violet-500/40 to-purple-500/10" />

                {/* Steps */}
                <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                        const status = getStepStatus(step.key);
                        const Icon = step.icon;
                        const timelineItem = timeline.find(t => t.status === step.key || (step.key === 'created' && t.status === 'pending'));

                        return (
                            <motion.div
                                key={step.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-start gap-4"
                            >
                                {/* Icon */}
                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${status === 'completed'
                                        ? 'bg-green-500/30 text-green-300 border border-green-400/50 shadow-[0_0_20px_rgba(34,197,94,0.35)]'
                                        : status === 'current'
                                            ? 'bg-purple-500/35 text-purple-100 border border-purple-300/60 shadow-[0_0_24px_rgba(147,51,234,0.55)] animate-pulse-slow'
                                            : 'bg-white/10 text-[#A78BFA] border border-purple-500/25'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-2">
                                    <h4 className={`font-semibold mb-1 ${status === 'completed' || status === 'current'
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </h4>

                                    {timelineItem && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-[#C4B5FD]">{timelineItem.note}</p>
                                            <p className="text-xs text-[#A78BFA] flex items-center gap-1">
                                                <FiClock className="w-3 h-3" />
                                                {formatDateTime(timelineItem.timestamp)}
                                            </p>
                                        </div>
                                    )}

                                    {!timelineItem && status === 'pending' && (
                                        <p className="text-sm text-[#A78BFA]">Pending</p>
                                    )}

                                    {step.key === 'assigned' && hasAssigned && !timelineItem && (
                                        <p className="text-sm text-[#C4B5FD]">Staff assigned</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatusTimeline;
