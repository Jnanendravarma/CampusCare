import { forwardRef } from 'react';

const Select = forwardRef(({
    label,
    error,
    options = [],
    placeholder = 'Select an option',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const baseStyles = 'w-full px-4 py-2.5 rounded-lg border border-purple-500/30 bg-white/5 text-[#E9D5FF] focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 transition-all duration-200 outline-none';
    const errorStyles = error ? 'border-error focus:border-error focus:ring-error/20' : '';

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-[#C4B5FD]">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`${baseStyles} ${errorStyles} ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-error">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
