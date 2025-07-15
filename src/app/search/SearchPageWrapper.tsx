'use client';

import { useEffect, useState } from 'react';
import SearchLoader from './SearchLoader';

interface SearchPageWrapperProps {
    children: React.ReactNode;
    keyword: string;
}

export default function SearchPageWrapper({ children, keyword }: SearchPageWrapperProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Show loader for a minimum time to prevent flash
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [keyword]);

    if (isLoading) {
        return <SearchLoader keyword={keyword} />;
    }

    return <>{children}</>;
} 