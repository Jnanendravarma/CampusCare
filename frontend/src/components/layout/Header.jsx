import { useNavigate, useLocation } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const Header = ({ user, onMenuToggle, isMobileMenuOpen, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns when route changes
    useEffect(() => {
        setShowProfile(false);
        setShowNotifications(false);
    }, [location.pathname]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    const handleProfileSettings = () => {
        setShowProfile(false);
        navigate('/profile');
    };

    return (
        <header className="sticky top-0 z-30 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-soft">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden text-[#C4B5FD] hover:text-[#E9D5FF] hover:bg-white/10 rounded-lg p-1 transition-all"
                        >
                            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                        <div className="flex items-center gap-2">
                            {/* Logo Icon */}
                            <motion.div
                                whileHover={{ rotate: 12, scale: 1.06 }}
                                transition={{ duration: 0.25 }}
                                className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.55)]"
                            >
                                <span className="text-[#E9D5FF] font-bold text-xl">C</span>
                            </motion.div>
                            {/* Title - visible on desktop */}
                            <span className="hidden sm:block font-accent text-xl font-bold tracking-wide gradient-text drop-shadow-[0_0_14px_rgba(168,85,247,0.65)]">
                                CampusCare
                            </span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-[#C4B5FD] hover:text-[#E9D5FF] hover:bg-white/10 rounded-lg transition-all"
                            >
                                <FiBell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                            </button>

                            <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-80 bg-[#1A0731]/95 rounded-xl shadow-large border border-purple-500/25 overflow-hidden backdrop-blur-xl"
                                >
                                    <div className="p-4 border-b border-purple-500/20">
                                        <h3 className="font-semibold text-[#E9D5FF]">Notifications</h3>
                                    </div>
                                    <div className="p-4 text-center text-[#A78BFA]">
                                        No new notifications
                                    </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>

                        {/* Profile */}
                        {user && (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    {user.avatar && user.avatar.startsWith('http') ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-primary-500/25 text-[#E9D5FF] rounded-full flex items-center justify-center font-semibold text-sm ring-2 ring-primary-400/40">
                                            {user.avatar || user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="hidden sm:block text-sm font-medium text-[#E9D5FF]">{user.name}</span>
                                </button>

                                <AnimatePresence>
                                {showProfile && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-56 bg-[#1A0731]/95 rounded-xl shadow-large border border-purple-500/25 overflow-hidden backdrop-blur-xl"
                                    >
                                        <div className="p-3 border-b border-purple-500/20">
                                            <p className="font-semibold text-[#E9D5FF]">{user.name}</p>
                                            <p className="text-sm text-[#A78BFA]">{user.email}</p>
                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 capitalize">{user.role}</span>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={handleProfileSettings}
                                                className="w-full text-left px-3 py-2 text-sm text-[#E9D5FF] hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <FiUser className="w-4 h-4" />
                                                Profile Settings
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <FiLogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
