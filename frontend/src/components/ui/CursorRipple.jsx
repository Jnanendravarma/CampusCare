import { useEffect, useState } from 'react';

const CursorRipple = () => {
    const [ripples, setRipples] = useState([]);

    useEffect(() => {
        const handleClick = (event) => {
            const id = `${Date.now()}-${Math.random()}`;
            const ripple = {
                id,
                x: event.clientX,
                y: event.clientY,
            };

            setRipples((prev) => [...prev, ripple]);
            setTimeout(() => {
                setRipples((prev) => prev.filter((item) => item.id !== id));
            }, 620);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute block w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/80 shadow-[0_0_26px_rgba(168,85,247,0.8)] animate-rippleBurst"
                    style={{ left: ripple.x, top: ripple.y }}
                />
            ))}
        </div>
    );
};

export default CursorRipple;
