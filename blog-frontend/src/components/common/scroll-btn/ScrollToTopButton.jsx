import './css/scroll-btn.css';
import { useEffect, useState } from "react";
import { Rocket } from 'lucide-react';

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isAnimatingOut]);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        if (scrollTop > 250) {
            setShowButton(true);
            setIsAnimatingOut(false);
        } else if (!isAnimatingOut) {
            setIsAnimatingOut(true);
            setTimeout(() => setShowButton(false), 900);
        };
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!showButton) return null;
    return (
        <div
            className={`scroll-up-btn ${isAnimatingOut ? 'scroll-up-exit' : 'scroll-up-enter'}`}
            onClick={scrollToTop}
        >
            <button className="scroll-up-inner-btn" title="scroll-top">
                <Rocket />
            </button>
        </div>
    );
};
export default ScrollToTopButton;