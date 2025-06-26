'use client';
import { useEffect } from 'react';

export default function HeaderClientWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const header = document.querySelector('.top-header');

        const handleScroll = () => {
            if (!header) return;

            if (window.scrollY > 50) {
                header.classList.add('sticky-header');
            } else {
                header.classList.remove('sticky-header');
            }
        };

        const handleLinkClick = () => {
            const inputs = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"], input[type="radio"]');
            inputs.forEach((input) => {
                input.checked = false;
            });
        };

        // Exclusive checkbox behavior
        const exclusiveCheckboxes = ['main', 'option1', 'option2'];
        exclusiveCheckboxes.forEach((id) => {
            const el = document.getElementById(id) as HTMLInputElement | null;
            if (el) {
                el.addEventListener('click', () => {
                    exclusiveCheckboxes.forEach((otherId) => {
                        const otherEl = document.getElementById(otherId) as HTMLInputElement | null;
                        if (otherEl && otherEl !== el) {
                            otherEl.checked = false;
                        }
                    });
                });
            }
        });

        // Search input logic
        const searchInput = document.querySelector<HTMLInputElement>('.search-input');
        const headerSearch = document.querySelector<HTMLElement>('.header-search');
        const submitButton = document.querySelector<HTMLButtonElement>('.search-btn');

        const handleSearchToggle = () => {
            if (!searchInput || !headerSearch) return;
            if (searchInput.checked) {
                headerSearch.classList.add('active');
            } else {
                headerSearch.classList.remove('active');
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (!searchInput || !headerSearch) return;
            const target = event.target as HTMLElement;
            const isClickInside =
                searchInput.contains(target) ||
                headerSearch.contains(target) ||
                target.closest('.search-toggle');

            if (!isClickInside) {
                searchInput.checked = false;
                headerSearch.classList.remove('active');
            }
        };

        const handleSubmitClick = () => {
            if (!searchInput || !headerSearch) return;
            searchInput.checked = false;
            headerSearch.classList.remove('active');
        };

        if (searchInput) {
            searchInput.addEventListener('change', handleSearchToggle);
        }

        if (submitButton) {
            submitButton.addEventListener('click', handleSubmitClick);
        }

        document.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        const links = document.querySelectorAll('a');
        links.forEach((link) => link.addEventListener('click', handleLinkClick));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClickOutside);
            links.forEach((link) => link.removeEventListener('click', handleLinkClick));
            if (searchInput) {
                searchInput.removeEventListener('change', handleSearchToggle);
            }
            if (submitButton) {
                submitButton.removeEventListener('click', handleSubmitClick);
            }
        };
    }, []);

    return <>{children}</>;
}
