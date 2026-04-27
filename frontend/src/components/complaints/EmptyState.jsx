import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
    icon: Icon = FiInbox,
    title = 'No items found',
    description = 'There are no items to display at the moment.',
    actionLabel,
    onAction
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/5 border border-purple-500/20 rounded-2xl"
        >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(147,51,234,0.45)]">
                <Icon className="w-10 h-10 text-purple-200" />
            </div>
            <h3 className="text-lg font-semibold text-[#E9D5FF] mb-2">{title}</h3>
            <p className="text-[#C4B5FD] max-w-md mb-6">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;
