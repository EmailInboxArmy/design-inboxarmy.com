'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollToTopHandler = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Handle browser back/forward button navigation
        const handlePopState = () => {
            // Small delay to ensure the page has loaded
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    //behavior: 'smooth'
                });
            }, 100);
        };

        // Listen for popstate events (back/forward button clicks)
        window.addEventListener('popstate', handlePopState);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    // Handle route changes (for client-side navigation)
    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({
            top: 0,
            //behavior: 'smooth'
        });
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTopHandler; 