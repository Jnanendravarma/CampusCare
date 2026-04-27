const Skeleton = ({ className = '', variant = 'default', count = 1 }) => {
    const variants = {
        default: 'h-4 w-full',
        title: 'h-8 w-3/4',
        text: 'h-4 w-full',
        avatar: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full',
        button: 'h-10 w-24',
    };

    const skeletons = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {skeletons.map((index) => (
                <div
                    key={index}
                    className={`animate-pulse shimmer bg-white/10 rounded ${variants[variant]} ${className}`}
                />
            ))}
        </>
    );
};

export default Skeleton;
