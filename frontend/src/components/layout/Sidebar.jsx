import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiUsers, FiSettings, FiPlusCircle, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ role, isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = {
        student: [
            { icon: FiHome, label: 'Dashboard', path: '/student/dashboard' },
            { icon: FiPlusCircle, label: 'Raise Complaint', path: '/student/raise-complaint' },
            { icon: FiFileText, label: 'My Complaints', path: '/student/complaints' },
            { icon: FiUser, label: 'My Profile', path: '/profile' },
        ],
        admin: [
            { icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: FiFileText, label: 'All Complaints', path: '/admin/complaints' },
            { icon: FiUsers, label: 'Staff Management', path: '/admin/staff' },
            { icon: FiUser, label: 'My Profile', path: '/profile' },
            { icon: FiSettings, label: 'Settings', path: '/admin/settings' },
        ],
        staff: [
            { icon: FiHome, label: 'Dashboard', path: '/staff/dashboard' },
            { icon: FiFileText, label: 'Assigned Tasks', path: '/staff/tasks' },
            { icon: FiUser, label: 'My Profile', path: '/profile' },
        ],
    };

    const items = menuItems[role] || menuItems.student;

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-20 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : -280 }}
                className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#110022]/95 backdrop-blur-xl border-r border-purple-500/20 z-20 lg:translate-x-0 lg:static lg:z-0 overflow-y-auto"
            >
                <nav className="p-4 space-y-2">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose && onClose()}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? 'bg-gradient-to-r from-purple-600/35 to-violet-600/20 text-[#E9D5FF] font-medium shadow-[0_0_20px_rgba(147,51,234,0.35)]'
                                    : 'text-[#C4B5FD] hover:bg-white/10 hover:text-[#E9D5FF]'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span>{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.9)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </motion.aside>
        </>
    );
};

export default Sidebar;
