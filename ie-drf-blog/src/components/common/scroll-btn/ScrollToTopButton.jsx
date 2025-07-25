import './css/scroll-btn.css';
import { useEffect, useState } from "react";
import { Rocket } from 'lucide-react';

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;

            if (scrollPercent > 10) {
                setShowButton(true);
                setIsAnimatingOut(false);
            } else if (!isAnimatingOut) {
                setIsAnimatingOut(true);
                setTimeout(() => setShowButton(false), 600);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isAnimatingOut]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!showButton) return null;

    return (
        <div
            className={`scroll-up-btn ${isAnimatingOut ? 'scroll-up-exit' : 'scroll-up-enter'}`}
            onClick={scrollToTop}
        >
            <button className="scroll-up-inner-btn">
                <Rocket />
            </button>
        </div>
    );
};

export default ScrollToTopButton;
