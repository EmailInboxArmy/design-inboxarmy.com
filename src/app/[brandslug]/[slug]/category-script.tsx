'use client';

import { useEffect } from 'react';

export default function CategoryPage({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const buttons = document.querySelectorAll('.email-wrapper .left-button');
        const mainElement = document.querySelector('.email-wrapper');
        const darkModeToggle = document.getElementById('DarkMode') as HTMLInputElement;

        const emailPostData = document.querySelector('.email-postdata') as HTMLElement;
        const emailCode = document.querySelector('.email-code') as HTMLElement;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const text = button.textContent?.trim().toLowerCase();

                if (text === 'desktop') {
                    mainElement?.classList.remove('mobilemode');
                    mainElement?.classList.add('desktopmode');

                    emailPostData?.classList.remove('hidden');
                    emailCode?.classList.add('hidden');

                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                if (text === 'mobile') {
                    mainElement?.classList.remove('desktopmode');
                    mainElement?.classList.add('mobilemode');

                    emailPostData?.classList.remove('hidden');
                    emailCode?.classList.add('hidden');

                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }

                if (text === 'code') {
                    const isActive = button.classList.contains('active');

                    if (isActive) {
                        // Toggle off code view
                        emailPostData?.classList.remove('hidden');
                        emailCode?.classList.add('hidden');
                        button.classList.remove('active');
                    } else {
                        // Show code view
                        emailPostData?.classList.add('hidden');
                        emailCode?.classList.remove('hidden');
                        button.classList.add('active');
                    }

                    // Do not touch desktop/mobile active states or wrapper classes
                }
            });
        });

        // Dark Mode Toggle
        const handleDarkMode = () => {
            if (darkModeToggle?.checked) {
                mainElement?.classList.add('darkmode');
            } else {
                mainElement?.classList.remove('darkmode');
            }
        };

        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', handleDarkMode);
        }

        return () => {
            buttons.forEach(button => {
                button.replaceWith(button.cloneNode(true));
            });
            if (darkModeToggle) {
                darkModeToggle.removeEventListener('change', handleDarkMode);
            }
        };
    }, []);

    return <>{children}</>;
}
