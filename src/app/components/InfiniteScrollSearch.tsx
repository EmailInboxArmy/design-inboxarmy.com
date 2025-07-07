'use client';

import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import EmailImage from '../images/email-1.jpg';

interface Post {
    id: string;
    title: string;
    slug: string;
    featuredImage: {
        node: {
            sourceUrl: string;
        };
    };
    industries: {
        nodes: { name: string }[];
    };
    seasonals: {
        nodes: { name: string }[];
    };
    emailTypes: {
        nodes: { name: string }[];
    };
}

interface InfiniteScrollSearchProps {
    initialPosts: Post[];
    hasNextPage: boolean;
    endCursor: string;
    searchKeyword: string;
}

export default function InfiniteScrollSearch({
    initialPosts,
    hasNextPage: initialHasNextPage,
    endCursor: initialEndCursor,
    searchKeyword
}: InfiniteScrollSearchProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [isLoading, setIsLoading] = useState(false);

    // Reset posts when search keyword changes
    useEffect(() => {
        setPosts(initialPosts);
        setHasNextPage(initialHasNextPage);
        setEndCursor(initialEndCursor);
    }, [searchKeyword, initialPosts, initialHasNextPage, initialEndCursor]);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    const loadMorePosts = useCallback(async () => {
        if (inView && hasNextPage && !isLoading) {
            setIsLoading(true);
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        search: searchKeyword,
                        after: endCursor,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.posts) {
                    setPosts(prev => [...prev, ...data.posts.nodes]);
                    setHasNextPage(data.posts.pageInfo.hasNextPage);
                    setEndCursor(data.posts.pageInfo.endCursor);
                }
            } catch (error) {
                console.error('Error loading more search results:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [inView, hasNextPage, endCursor, isLoading, searchKeyword]);

    useEffect(() => {
        loadMorePosts();
    }, [loadMorePosts]);

    // Check if there are any taxonomies available
    const hasEmailTypes = posts[0]?.emailTypes?.nodes?.length > 0;
    const hasIndustries = posts[0]?.industries?.nodes?.length > 0;
    const hasSeasonals = posts[0]?.seasonals?.nodes?.length > 0;
    const hasAnyTaxonomy = hasEmailTypes || hasIndustries || hasSeasonals;

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
                                {hasAnyTaxonomy && (
                                    <span className="text-xxs md:text-sm block leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal">Other</span>
                                )}                               
                            </div>
                        </div>
                    </Link>
                </div>
            ))}

            {hasNextPage && (
                <div ref={ref} className="col-span-full h-20 flex items-center justify-center">
                    {isLoading && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-blue mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Loading more results...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 