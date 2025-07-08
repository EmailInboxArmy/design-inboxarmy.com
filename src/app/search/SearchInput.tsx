'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import SearchIcon from '../images/search-icon.svg';

interface SearchInputProps {
    searchKeyword: string;
}

export default function SearchInput({ searchKeyword }: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState(searchKeyword);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Update search term when URL changes
    useEffect(() => {
        const keyword = searchParams.get('keyword') || '';
        setSearchTerm(keyword);
    }, [searchParams]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setIsLoading(true);

        try {
            const searchUrl = `/search?keyword=${encodeURIComponent(searchTerm.trim())}`;
            await router.push(searchUrl);
        } catch (error) {
            console.error('Navigation error:', error);
        } finally {
            // Keep loading state for a bit to show the loader
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center gap-4 search-form max-w-lg mx-auto">
            <div className="search-row flex items-center bg-theme-light-gray rounded-xl w-full py-1 pr-2 relative">
                <input
                    type="text"
                    required
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search brands or keywords"
                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="search-btn bg-theme-blue hover:bg-theme-dark px-3 py-0 min-w-fit rounded-md text-white border-none absolute top-2 right-2 bottom-2 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        <Image src={SearchIcon} width={15} height={15} alt="Icon" />
                    )}
                </button>
            </div>
        </form>
    );
} 