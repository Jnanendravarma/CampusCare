import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatDate, getStatusColor, getPriorityColor, truncate } from '../../utils/helpers';
import { getUserById } from '../../data/mockData';
import { FiClock, FiUser } from 'react-icons/fi';

const ComplaintCard = ({ complaint, showUser = false, onClick }) => {
    const user = showUser && complaint.userId ? getUserById(complaint.userId) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl shadow-soft hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all duration-300 overflow-hidden cursor-pointer border border-purple-500/20 hover:border-purple-400/50"
            onClick={onClick}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{complaint.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{truncate(complaint.description, 100)}</p>
                    </div>
                    <Badge variant={getStatusColor(complaint.status)}>
                        {complaint.status.replace('-', ' ')}
                    </Badge>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="inline-flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {formatDate(complaint.createdAt)}
                    </span>
                    {showUser && user && (
                        <span className="inline-flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            {user.name}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-white/10 text-[#C4B5FD] rounded-md text-xs font-medium capitalize border border-purple-500/20">
                            {complaint.category}
                        </span>
                        <Badge variant={getPriorityColor(complaint.priority)} className="capitalize">
                            {complaint.priority}
                        </Badge>
                    </div>
                    <span className="text-xs font-medium text-primary-600">#{complaint.id}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ComplaintCard;
