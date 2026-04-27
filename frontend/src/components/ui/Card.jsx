import { motion } from 'framer-motion';
import { card3D, motionTimings } from '../../utils/animations';

const Card = ({
    children,
    className = '',
    hover = true,
    glass = false,
    glassDark = false,
    gradient = false,
    glow = false,
    effect3d = false,
    ...props
}) => {
    const baseStyles = 'bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl shadow-soft overflow-hidden';
    const hoverStyles = hover && !effect3d ? 'card-hover' : '';
    const glassStyles = glass ? 'glass' : glassDark ? 'glass-dark' : '';
    const gradientStyles = gradient ? 'gradient-border' : '';
    const glowStyles = glow ? 'glow-on-hover' : '';
    const effect3dStyles = effect3d ? 'card-3d' : '';

    // Use 3D animation variant if effect3d is enabled
    const animationVariants = effect3d ? card3D : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: motionTimings.base }
    };

    return (
        <motion.div
            initial={animationVariants.initial || "rest"}
            animate={animationVariants.animate || "rest"}
            whileHover={effect3d ? "hover" : undefined}
            whileTap={effect3d ? "tap" : undefined}
            variants={effect3d ? card3D : undefined}
            transition={!effect3d ? animationVariants.transition : undefined}
            className={`${baseStyles} ${hoverStyles} ${glassStyles} ${gradientStyles} ${glowStyles} ${effect3dStyles} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;

