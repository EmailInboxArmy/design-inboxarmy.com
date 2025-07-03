'use client';

import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
    featuredImage?: {
        node?: {
            sourceUrl?: string;
            altText?: string;
        };
    };
    slug: string;
    title: string;
    brandCategories?: {
        nodes: Array<{
            name: string;
            slug: string;
        }>;
    };
}

interface BrandCategory {
    name: string;
    slug: string;
}

interface InfiniteScrollBrandsProps {
    initialBrands: Brand[];
    hasNextPage: boolean;
    endCursor: string;
    brandCategories: BrandCategory[];
}

export default function InfiniteScrollBrands({
    initialBrands,
    hasNextPage: initialHasNextPage,
    endCursor: initialEndCursor,
    brandCategories
}: InfiniteScrollBrandsProps) {
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    useEffect(() => {
        const loadMoreBrands = async () => {
            if (inView && hasNextPage && !isLoading && !searchTerm.trim() && !selectedCategory) {
                setIsLoading(true);
                try {
                    const response = await fetch('/api/brands', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            after: endCursor,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.brands) {
                        setBrands(prev => [...prev, ...data.brands.nodes]);
                        setHasNextPage(data.brands.pageInfo.hasNextPage);
                        setEndCursor(data.brands.pageInfo.endCursor);
                    }
                } catch (error) {
                    console.error('Error loading more brands:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadMoreBrands();
    }, [inView, hasNextPage, endCursor, isLoading, searchTerm, selectedCategory]);

    // Function to perform search - server side search
    const performSearch = useCallback(async (search: string) => {
        console.log('Performing server-side search for:', search);

        setIsSearching(true);
        setIsLoading(true);
        try {
            const response = await fetch('/api/brands/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search: search.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.brands) {
                console.log('Search results count:', data.brands.nodes.length);
                setBrands(data.brands.nodes);
                setHasNextPage(false); // No pagination for search results
                setEndCursor('');
            } else {
                setBrands([]);
                setHasNextPage(false);
                setEndCursor('');
            }
        } catch (error) {
            console.error('Error searching brands:', error);
            setBrands([]);
            setHasNextPage(false);
            setEndCursor('');
        } finally {
            setIsLoading(false);
            setIsSearching(false);
        }
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim()) {
                performSearch(searchTerm.trim());
            } else {
                // Reset to initial state if no search/filter
                setBrands(initialBrands);
                setHasNextPage(initialHasNextPage);
                setEndCursor(initialEndCursor);
                setIsSearching(false);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [searchTerm, initialBrands, initialHasNextPage, initialEndCursor, performSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (searchTerm.trim()) {
            performSearch(searchTerm.trim());
        } else {
            // Reset to initial state if search is cleared
            setBrands(initialBrands);
            setHasNextPage(initialHasNextPage);
            setEndCursor(initialEndCursor);
            setIsSearching(false);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);

        // If a category is selected, reset search and show all brands
        if (newCategory) {
            setSearchTerm('');
            setBrands(initialBrands);
            setHasNextPage(initialHasNextPage);
            setEndCursor(initialEndCursor);
            setIsSearching(false);
        }
    };

    // Filter brands by category on client side (applied to current brands state)
    const filteredBrands = selectedCategory
        ? brands.filter((brand: Brand) =>
            brand.brandCategories?.nodes?.some((category: { name: string; slug: string }) => category.slug === selectedCategory)
        )
        : brands;

    return (
        <>
            <div className="container">
                <div className='lg:px-20 md:pt-6 md:pb-1'>
                    <div className="bg-gradient-to-r from-[#E9EFE9] to-[#DEE5C5] rounded-2xl lg:rounded-3xl pb-0 p-4 md:p-6 md:px-8 flex flex-wrap items-center justify-between">
                        <div className="w-full md:w-7/12 search-row lg:pr-10">
                            <form onSubmit={handleSearchSubmit} className='flex w-full flex-wrap items-center bg-theme-light-gray rounded-xl py-1.5 md:py-1 relative'>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search brands"
                                    className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
                                />
                                <button type="submit" className="search-btn bg-theme-blue hover:bg-theme-dark px-3 py-0 min-w-fit rounded-md text-white border-none absolute top-2 right-2 bottom-2">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <div className='w-full md:w-5/12'>
                            <div className='flex justify-center md:justify-end'>
                                <div className='w-full md:w-[205px]'>
                                    <select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        className='w-full cursor-pointer text-base font-medium bg-transparent border-none px-2 py-3 md:py-6 pr-4'
                                    >
                                        <option value="">Brands by Category</option>
                                        {brandCategories.map((category) => (
                                            <option key={category.slug} value={category.slug}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='pt-12 pb-10 md:pt-24 md:pb-24'>
                <div className='container'>
                    {searchTerm.trim() && (
                        <div className="text-center mb-8">
                            <p className="text-lg text-gray-600">
                                Found {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} for &ldquo;{searchTerm}&rdquo;
                            </p>
                        </div>
                    )}
                    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-4 md:gap-6 lg:gap-9 lg:px-10'>
                        {filteredBrands.map((brand: Brand, index: number) => (
                            <Link key={`${brand.slug}-${index}`} href={`/brands/${brand.slug}`} className="bg-white rounded-2xl shadow-md py-8 px-6 flex flex-col items-center border border-solid border-theme-border origin-center transition-all ease-in-out lg:hover:scale-105">
                                <div className="w-28 lg:w-[150px] h-28 lg:h-[150px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-3xl font-bold">
                                    {brand.featuredImage?.node?.sourceUrl ? (
                                        <Image
                                            className="w-full h-full object-cover"
                                            src={brand.featuredImage.node.sourceUrl}
                                            alt={brand.featuredImage.node.altText || brand.title || "Brand Image"}
                                            width={150}
                                            height={150}
                                        />
                                    ) : (
                                        brand.title?.charAt(0).toUpperCase() || '?'
                                    )}
                                </div>
                                <p className="mt-4 text-base md:text-lg font-semibold text-[#2E2B29]">{brand.title}</p>
                            </Link>
                        ))}
                    </div>

                    {filteredBrands.length === 0 && !isLoading && !isSearching && (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">No brands found matching your search criteria.</p>
                        </div>
                    )}

                    {(isLoading || isSearching) && (
                        <div className="col-span-full h-10 flex items-center justify-center mt-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    )}

                    {hasNextPage && !isLoading && (
                        <div ref={ref} className="col-span-full h-10 flex items-center justify-center mt-8">
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 