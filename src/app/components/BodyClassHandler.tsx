'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function BodyClassHandler({ classname }: { classname?: string }) {
    const pathname = usePathname();

    useEffect(() => {
        // Remove any existing page-* classes
        document.body.className = document.body.className.replace(/page-\S+/g, '').trim();

        let pageClass = '';

        if (classname) {
            // Use provided classname (add page- prefix only if not already present)
            pageClass = classname.startsWith('page-') ? classname : `page-${classname}`;
        } else {
            // Extract slug from pathname
            let slug = 'home'; // default for home page

            if (pathname === '/') {
                slug = 'home';
            } else {
                // Remove leading slash and get the first segment
                const segments = pathname.split('/').filter(Boolean);
                if (segments.length > 0) {
                    slug = segments[0];
                }
            }
            pageClass = `page-${slug}`;
        }

        // Add the new page class
        document.body.className = document.body.className ?
            `${document.body.className} ${pageClass}` : pageClass;

    }, [pathname, classname]);

    return null; // This component doesn't render anything
} 