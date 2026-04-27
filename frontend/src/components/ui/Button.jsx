import { motion } from 'framer-motion';
import { buttonHover, motionTimings } from '../../utils/animations';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    loading = false,
    gradient = false,
    glow = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden hover:-translate-y-1';

    const variants = {
        primary: gradient
            ? 'btn-gradient text-white'
            : 'bg-gradient-to-r from-purple-600 to-violet-700 text-[#E9D5FF] hover:brightness-110 shadow-soft hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]',
        secondary: gradient
            ? 'gradient-bg-secondary text-white'
            : 'bg-white/10 text-[#E9D5FF] hover:bg-white/20 border border-purple-500/30',
        outline: 'border-2 border-purple-500/60 text-[#C4B5FD] hover:bg-purple-500/15',
        ghost: 'text-[#C4B5FD] hover:bg-purple-500/10',
        danger: gradient
            ? 'gradient-bg-error text-white'
            : 'bg-error text-white hover:bg-error-dark shadow-soft',
        success: gradient
            ? 'gradient-bg-success text-white'
            : 'bg-success text-white hover:bg-success-dark shadow-soft',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5',
    };

    const glowClass = glow ? 'glow-on-hover' : '';

    return (
        <motion.button
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={buttonHover}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowClass} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <motion.svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: motionTimings.loop / 2, repeat: Infinity, ease: "linear" }}
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </motion.svg>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    );
};

export default Button;

