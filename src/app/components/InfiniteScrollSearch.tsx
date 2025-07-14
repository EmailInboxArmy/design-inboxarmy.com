'use client';

import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import EmailImage from '../images/email-1.jpg';
import { Post } from '../types/post';

interface InfiniteScrollSearchProps {
    initialPosts: Post[];
    hasNextPage: boolean;
    endCursor: string;
    searchKeyword: string;
    currentPage?: number;
    totalPages?: number;
}

interface TaxonomyNode {
    name: string;
    id?: string;
    slug?: string;
}

interface TaxonomyData {
    nodes: TaxonomyNode[];
}

interface ApiPostItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText?: string;
        };
    };
    emailTypes?: {
        nodes: TaxonomyNode[] | string;
    };
    industries?: {
        nodes: TaxonomyNode[] | string;
    };
    seasonals?: {
        nodes: TaxonomyNode[] | string;
    };
}

export default function InfiniteScrollSearch({
    initialPosts,
    hasNextPage: initialHasNextPage,
    endCursor: initialEndCursor,
    searchKeyword,
    currentPage = 1,
    totalPages = 1
}: InfiniteScrollSearchProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPageState, setCurrentPageState] = useState(currentPage);
    const loadingRef = useRef(false);

    console.log('InfiniteScrollSearch props:', {
        initialPosts: initialPosts.length,
        initialHasNextPage,
        initialEndCursor,
        searchKeyword,
        currentPage,
        totalPages
    });

    // Reset posts when search keyword or page changes
    useEffect(() => {
        console.log('Resetting posts for new search:', searchKeyword, 'page:', currentPage);
        setPosts(initialPosts);
        setHasNextPage(initialHasNextPage);
        setCurrentPageState(currentPage);
        loadingRef.current = false;
    }, [searchKeyword, currentPage, initialPosts, initialHasNextPage, initialEndCursor]);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    // Single effect to handle infinite scroll
    useEffect(() => {
        const loadMorePosts = async () => {
            console.log('Load more check:', {
                loadingRef: loadingRef.current,
                inView,
                hasNextPage,
                currentPageState
            });

            // Don't load if already loading, no next page, or not in view
            if (loadingRef.current || !inView || !hasNextPage) return;

            console.log('Starting to load more posts...');

            // Set loading state
            loadingRef.current = true;
            setIsLoading(true);

            try {
                // Use the new REST API endpoint for pagination
                const nextPage = currentPageState + 1;
                const response = await fetch(
                    `https://design-backend.inboxarmy.com/wp-json/custom/v1/search-posts?keyword=${encodeURIComponent(searchKeyword)}&page=${nextPage}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Load more response:', data);

                if (data.nodes && Array.isArray(data.nodes)) {
                    console.log('Adding new posts:', data.nodes.length);

                    // Helper function to safely parse taxonomy nodes
                    const parseTaxonomyNodes = (taxonomyData: TaxonomyNode[] | string | undefined): TaxonomyData => {
                        if (Array.isArray(taxonomyData)) {
                            return { nodes: taxonomyData };
                        } else if (typeof taxonomyData === 'string' && taxonomyData.trim()) {
                            // If it's a string, try to parse it as JSON or split by comma
                            try {
                                const parsed = JSON.parse(taxonomyData);
                                return { nodes: Array.isArray(parsed) ? parsed : [] };
                            } catch {
                                // If not JSON, split by comma and create objects
                                const items = taxonomyData.split(',').map((name: string) => ({ name: name.trim() }));
                                return { nodes: items };
                            }
                        }
                        return { nodes: [] };
                    };

                    // Transform the data to match the expected Post interface
                    const newPosts: Post[] = data.nodes.map((item: ApiPostItem) => ({
                        id: item.id || String(Math.random()),
                        title: item.title || '',
                        slug: item.slug || '',
                        excerpt: item.excerpt || '',
                        date: item.date || '',
                        featuredImage: item.featuredImage || {
                            node: {
                                sourceUrl: '',
                                altText: item.title || ''
                            }
                        },
                        emailTypes: parseTaxonomyNodes(item.emailTypes?.nodes),
                        industries: parseTaxonomyNodes(item.industries?.nodes),
                        seasonals: parseTaxonomyNodes(item.seasonals?.nodes),
                    }));

                    setPosts(prev => [...prev, ...newPosts]);
                    setCurrentPageState(nextPage);

                    // Check if there are more pages from pagination info
                    const pagination = data.pagination || {};
                    const hasMorePages = nextPage < (parseInt(pagination.total_pages) || totalPages);
                    setHasNextPage(hasMorePages);
                }
            } catch (error) {
                console.error('Error loading more search results:', error);
            } finally {
                loadingRef.current = false;
                setIsLoading(false);
            }
        };
        loadMorePosts();
    }, [inView, hasNextPage, searchKeyword, currentPageState, totalPages]);

    // Check if there are any taxonomies available
    const firstPost = posts[0];
    const hasEmailTypes = firstPost?.emailTypes?.nodes && firstPost.emailTypes.nodes.length > 0;
    const hasIndustries = firstPost?.industries?.nodes && firstPost.industries.nodes.length > 0;
    const hasSeasonals = firstPost?.seasonals?.nodes && firstPost.seasonals.nodes.length > 0;
    const hasAnyTaxonomy = hasEmailTypes || hasIndustries || hasSeasonals;

    console.log('Rendering posts:', posts.length, 'hasNextPage:', hasNextPage, 'isLoading:', isLoading);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 md:gap-5 2xl:gap-8 pb-4 md:pb-12">
            {posts.map((post: Post) => (
                <div
                    key={post.id}
                    className="w-full bg-white shadow-custom rounded-md md:rounded-xl border border-solid border-theme-border overflow-hidden"
                >
                    <Link href={`/${post.slug}`} className="email-link">
                        <div className="email-image relative w-full overflow-hidden">
                            <Image
                                className="absolute left-0 right-0 w-full"
                                src={post.featuredImage?.node?.sourceUrl || EmailImage}
                                width={280}
                                height={480}
                                alt={post.title || "Email template image"}
                            />
                        </div>
                        <div className="p-2 md:p-4">
                            <p className="text-theme-dark text-sm md:text-base mb-2">{post.title}</p>
                            <div className="flex flex-wrap gap-2 catagery-data">
                                {post.emailTypes?.nodes?.map(emailType => (
                                    <span
                                        key={emailType.name}
                                        className="text-xxs md:text-sm leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal"
                                    >
                                        {emailType.name}
                                    </span>
                                ))}
                                {post.industries?.nodes?.map(industry => (
                                    <span
                                        key={industry.name}
                                        className="text-xxs md:text-sm leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal"
                                    >
                                        {industry.name}
                                    </span>
                                ))}
                                {post.seasonals?.nodes?.map(seasonal => (
                                    <span
                                        key={seasonal.name}
                                        className="text-xxs md:text-sm leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal"
                                    >
                                        {seasonal.name}
                                    </span>
                                ))}
                                {!hasAnyTaxonomy && (
                                    <span className="text-xxs md:text-sm block leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal">Other</span>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {/* Load more trigger - always show if hasNextPage */}
            {hasNextPage && (
                <div ref={ref} className="col-span-full h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg postloader">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-blue mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading more results...</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Scroll to load more...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Debug info - remove in production
            {process.env.NODE_ENV === 'development' && (
                <div className="col-span-full p-4 bg-gray-100 rounded-lg text-xs">
                    <p>Debug: Posts: {posts.length}, HasNextPage: {hasNextPage.toString()}, Loading: {isLoading.toString()}</p>
                    <p>EndCursor: {endCursor || 'none'}</p>
                </div>
            )} */}
        </div>
    );
} 