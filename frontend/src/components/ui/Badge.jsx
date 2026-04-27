import { motion } from 'framer-motion';

const Badge = ({ children, variant = 'pending', icon, pulse = false, className = '' }) => {
    const variants = {
        pending: 'bg-amber-500/15 text-amber-300 border-amber-400/45 shadow-[0_0_18px_rgba(245,158,11,0.35)]',
        'in-progress': 'bg-purple-500/20 text-purple-200 border-purple-400/45 shadow-[0_0_18px_rgba(147,51,234,0.45)]',
        resolved: 'bg-green-500/15 text-green-300 border-green-400/45 shadow-[0_0_18px_rgba(34,197,94,0.35)]',
        rejected: 'bg-error/10 text-error-dark border-error/20',
        low: 'bg-white/10 text-[#C4B5FD] border-purple-500/25',
        medium: 'bg-amber-500/15 text-amber-300 border-amber-400/35',
        high: 'bg-red-500/15 text-red-300 border-red-400/35',
    };

    const pulseAnimation = pulse ? 'animate-pulse-slow' : '';

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${pulseAnimation} ${className}`}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.span>
    );
};

export default Badge;
