'use client';

import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams?: Record<string, string>;
}

export default function Pagination({
    currentPage,
    totalPages,
    baseUrl,
    searchParams = {}
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    const buildUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <div className="postloader">
                {hasPreviousPage && (
                    <Link href={buildUrl(currentPage - 1)} > </Link>
                )}

                {/* <div className="flex items-center space-x-1">
                    {renderPageNumbers()}
                </div> */}

                {hasNextPage && (
                    <Link href={buildUrl(currentPage + 1)} > </Link>
                )}
            </div>
            <div className="loading-spinner">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-blue mx-auto mb-4"></div>
            </div>
        </div>
    );
} 