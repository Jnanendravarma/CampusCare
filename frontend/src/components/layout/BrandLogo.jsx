import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BrandLogo = ({ to = '/', compact = false, className = '' }) => {
    const letters = 'CampusCare'.split('');

    return (
        <Link to={to} className={`group inline-flex items-center gap-2.5 ${className}`}>
            <motion.div
                whileHover={{ rotate: 12, scale: 1.06 }}
                transition={{ duration: 0.25 }}
                className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.55)]"
            >
                <span className="text-[#E9D5FF] font-bold text-xl font-accent">C</span>
            </motion.div>
            {!compact && (
                <span className="font-accent text-xl sm:text-2xl font-bold tracking-wide gradient-text drop-shadow-[0_0_14px_rgba(168,85,247,0.65)]">
                    {letters.map((ch, index) => (
                        <span
                            key={`${ch}-${index}`}
                            className="brand-letter"
                            style={{ animationDelay: `${index * 0.045}s` }}
                        >
                            {ch}
                        </span>
                    ))}
                </span>
            )}
        </Link>
    );
};

export default BrandLogo;
