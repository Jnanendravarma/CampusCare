import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const icons = {
        success: <FiCheckCircle className="w-5 h-5" />,
        error: <FiXCircle className="w-5 h-5" />,
        warning: <FiAlertCircle className="w-5 h-5" />,
        info: <FiInfo className="w-5 h-5" />,
    };

    const styles = {
        success: 'bg-green-600/90 text-green-50 border border-green-400/45',
        error: 'bg-red-600/90 text-red-50 border border-red-400/45',
        warning: 'bg-amber-500/90 text-amber-50 border border-amber-300/45',
        info: 'bg-purple-600/90 text-purple-50 border border-purple-300/45',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`${styles[toast.type]} px-4 py-3 rounded-lg shadow-large backdrop-blur-xl flex items-center gap-3 min-w-[300px] max-w-md`}
        >
            {icons[toast.type]}
            <p className="flex-1 font-medium">{toast.message}</p>
            <button onClick={onClose} className="hover:opacity-80 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    );
};

export default Toast;
