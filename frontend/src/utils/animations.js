// Animation variants and utilities for Framer Motion
// Provides consistent, reusable animations throughout the app

export const motionTimings = {
    micro: 0.16,
    fast: 0.24,
    base: 0.34,
    slow: 0.48,
    entry: 0.56,
    loop: 2.4,
    float: 3.6,
    stagger: 0.08,
};

export const motionEase = {
    smooth: [0.22, 1, 0.36, 1],
    soft: [0.4, 0, 0.2, 1],
};

// ============================================
// BASIC ANIMATIONS (Keep existing for compatibility)
// ============================================

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const slideInFromLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
};

export const slideInFromRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
};

export const slideInFromTop = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
};

export const slideInFromBottom = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: motionTimings.stagger,
        },
    },
};

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: motionTimings.base, ease: motionEase.smooth },
    },
};

export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: motionTimings.base, ease: motionEase.soft },
};

// ============================================
// 3D TRANSFORMS & TILT EFFECTS
// ============================================

export const card3D = {
    rest: {
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    hover: {
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: {
            type: "spring",
            stiffness: 320,
            damping: 24,
        },
    },
    tap: {
        scale: 0.98,
    },
};

// ============================================
// ENHANCED ENTRANCE ANIMATIONS
// ============================================

export const fadeInUp = {
    initial: {
        opacity: 0,
        y: 60,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: motionTimings.entry,
            ease: motionEase.smooth,
        },
    },
};

export const fadeInScale = {
    initial: {
        opacity: 0,
        scale: 0.8,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: motionTimings.slow,
            ease: motionEase.smooth,
        },
    },
};

// ============================================
// CONTINUOUS ANIMATIONS
// ============================================

export const float = {
    animate: {
        y: [0, -15, 0],
        transition: {
            duration: motionTimings.float,
            repeat: Infinity,
            ease: motionEase.soft,
        },
    },
};

export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: motionTimings.loop,
            repeat: Infinity,
            ease: motionEase.soft,
        },
    },
};

export const glowPulse = {
    animate: {
        boxShadow: [
            "0 0 20px rgba(102, 126, 234, 0.4)",
            "0 0 40px rgba(102, 126, 234, 0.8)",
            "0 0 20px rgba(102, 126, 234, 0.4)",
        ],
        transition: {
            duration: motionTimings.loop,
            repeat: Infinity,
            ease: motionEase.soft,
        },
    },
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonHover = {
    rest: {
        scale: 1,
    },
    hover: {
        scale: 1.03,
        transition: {
            type: "spring",
            stiffness: 360,
            damping: 20,
        },
    },
    tap: {
        scale: 0.95,
    },
};

export const buttonGlow = {
    rest: {
        boxShadow: "0 0 0 rgba(102, 126, 234, 0)",
    },
    hover: {
        boxShadow: "0 0 30px rgba(102, 126, 234, 0.6)",
        transition: {
            duration: motionTimings.fast,
            ease: motionEase.soft,
        },
    },
};

// ============================================
// MODAL ANIMATIONS
// ============================================

export const modalBackdrop = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: motionTimings.base,
            ease: motionEase.soft,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: motionTimings.base,
            ease: motionEase.soft,
        },
    },
};

export const modalContent = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 50,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 24,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 50,
        transition: {
            duration: motionTimings.fast,
            ease: motionEase.soft,
        },
    },
};

// ============================================
// BADGE ANIMATIONS
// ============================================

export const badgePulse = {
    animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: motionTimings.loop,
            repeat: Infinity,
            ease: motionEase.soft,
        },
    },
};

// ============================================
// ICON ANIMATIONS
// ============================================

export const iconBounce = {
    rest: {
        y: 0,
    },
    hover: {
        y: [-5, 0, -5],
        transition: {
            duration: motionTimings.entry,
            repeat: Infinity,
            ease: motionEase.soft,
        },
    },
};

export const iconRotate = {
    rest: {
        rotate: 0,
    },
    hover: {
        rotate: 360,
        transition: {
            duration: motionTimings.entry,
            ease: motionEase.soft,
        },
    },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if user prefers reduced motion
export const shouldReduceMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get animation with reduced motion support
export const getAnimation = (animation) => {
    if (shouldReduceMotion()) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        };
    }
    return animation;
};

// Spring configuration presets
export const springConfigs = {
    gentle: { type: "spring", stiffness: 100, damping: 15 },
    wobbly: { type: "spring", stiffness: 300, damping: 10 },
    stiff: { type: "spring", stiffness: 400, damping: 25 },
    slow: { type: "spring", stiffness: 80, damping: 20 },
};
