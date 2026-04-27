import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
    label,
    error,
    icon,
    type = 'text',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 rounded-lg border border-purple-500/30 bg-white/5 text-[#E9D5FF] placeholder:text-[#A78BFA] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 transition-all duration-200 outline-none';
    const errorStyles = error ? 'border-error focus:border-error focus:ring-error/20' : '';
    const iconStyles = icon ? 'pl-11' : '';

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-[#C4B5FD]">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A78BFA]">
                        {icon}
                    </div>
                )}
                <motion.input
                    ref={ref}
                    type={type}
                    className={`${baseStyles} ${errorStyles} ${iconStyles} ${className}`}
                    whileFocus={{ scale: 1.01 }}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-error"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
