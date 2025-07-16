'use client';

import { useEffect, useState, useRef } from 'react';
import EmailCard from "./EmailCard";
import { useInView } from 'react-intersection-observer';
import Image from "next/image";
import Link from "next/link";

interface Template {
    title: string;
    slug: string;
    featuredImage?: {
        node?: {
            sourceUrl: string;
        };
    };
    postdata?: {
        brand?: {
            nodes: {
                slug: string;
                brandCategories: {
                    nodes: {
                        name: string;
                    }[];
                };
            }[];
        };
    };
    emailTypes?: {
        nodes: Array<{
            name: string;
        }>;
    };
    industries?: {
        nodes: Array<{
            name: string;
        }>;
    };
    seasonals?: {
        nodes: Array<{
            name: string;
        }>;
    };
}

interface AdBox {
    title: string;
    icon: {
        node: {
            sourceUrl: string;
        };
    };
    cta: {
        url: string;
        title: string;
        target: string;
    };
}

interface InfiniteScrollBrandPostsProps {
    initialTemplates: Template[];
    hasNextPage: boolean;
    endCursor: string;
    adBoxes: AdBox[];
    brandId: string;
    activeTagSlug?: string;
}

// AdCard component for rendering individual ads
function AdCard({ adBox }: { adBox: AdBox }) {
    return (
        <Link
            href={adBox.cta?.url || "#"}
            target={adBox.cta?.target || "_self"}
            className="inboxarmy-ads relative w-full bg-theme-dark text-white text-center shadow-custom rounded-xl border border-solid border-theme-border flex items-center justify-start"
        >
            <div className="ads-logo relative pb-16 md:pb-20 2xl:pb-16 w-full">
                <Image
                    className="block m-auto"
                    src={adBox.icon?.node?.sourceUrl || '/default-logo.svg'}
                    width={280}
                    height={480}
                    alt="Brand Logo"
                />
                <div className="px-4 2xl:px-6 mt-12 md:mt-8 2xl:mt-16">
                    <div className=" 2xl:mb-2">
                        <p className="content-text h3 text-white" dangerouslySetInnerHTML={{ __html: adBox.title }}></p>
                    </div>
                </div>
            </div>

            <div className="absolute left-3 right-3 bottom-6 md:bottom-4 2xl:left-7 2xl:right-7 2xl:bottom-8">
                <span className="block bg-theme-blue text-white hover:bg-white hover:text-theme-dark font-semibold px-1 py-3 md:py-4 rounded-lg whitespace-nowrap border-none uppercase text-xs md:text-base">
                    {adBox.cta?.title || 'Explore More'}
                </span>
            </div>
        </Link>
    );
}

export default function InfiniteScrollBrandPosts({
    initialTemplates,
    hasNextPage: initialHasNextPage,
    endCursor: initialEndCursor,
    adBoxes,
    brandId,
    activeTagSlug
}: InfiniteScrollBrandPostsProps) {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [isLoading, setIsLoading] = useState(false);
    const [lastLoadedBatch, setLastLoadedBatch] = useState(0);
    const loadingRef = useRef(false);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    // Single effect to handle infinite scroll
    useEffect(() => {
        const loadMoreTemplates = async () => {
            // Don't load if already loading, no next page, or not in view
            if (loadingRef.current || !inView || !hasNextPage) return;

            // Calculate the exact threshold for the next batch
            const currentBatchSize = 24;
            const nextBatchThreshold = (lastLoadedBatch + 1) * currentBatchSize;

            // Only load if we have exactly reached the threshold
            if (templates.length !== nextBatchThreshold) return;

            // Set loading state
            loadingRef.current = true;
            setIsLoading(true);

            try {
                const response = await fetch('/api/brand-posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        after: endCursor,
                        brandId: brandId,
                    }),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();

                if (data.posts && data.posts.nodes.length > 0) {
                    setTemplates(prev => [...prev, ...data.posts.nodes]);
                    setHasNextPage(data.posts.pageInfo.hasNextPage);
                    setEndCursor(data.posts.pageInfo.endCursor);
                    setLastLoadedBatch(lastLoadedBatch + 1);
                }
            } catch (error) {
                console.error('Error loading more brand posts:', error);
            } finally {
                loadingRef.current = false;
                setIsLoading(false);
            }
        };
        loadMoreTemplates();
    }, [inView, endCursor, templates.length, lastLoadedBatch, hasNextPage, brandId]);

    // Function to render items with ads at specific positions: 6, 12, 24, 36, 48, etc.
    const renderItemsWithAds = () => {
        const items = [];

        for (let i = 0; i < templates.length; i++) {
            // Template card
            items.push(
                <EmailCard
                    key={`template-${templates[i].title}-${i}`}
                    title={templates[i].title}
                    image={templates[i].featuredImage?.node?.sourceUrl || ''}
                    slug={templates[i].slug}
                    postdata={templates[i].postdata}
                    template={templates[i] as Template & {
                        emailTypes: { nodes: { name: string }[] };
                        industries: { nodes: { name: string }[] };
                        seasonals: { nodes: { name: string }[] };
                        brand: { nodes: { name: string, slug: string, brandCategories: { nodes: { name: string } }[] }[] };
                    }}
                    activeTagSlug={activeTagSlug}
                />
            );

            const position = i + 1;
            const shouldShowAd = position === 5 || (position >= 12 && position % 12 === 0);

            if (shouldShowAd && adBoxes && adBoxes.length > 0) {
                let adIndex;
                if (position === 5) {
                    adIndex = 0;
                } else if (position === 12) {
                    adIndex = 1;
                } else {
                    adIndex = Math.floor((position / 12) - 2) % adBoxes.length;
                }

                adIndex = Math.max(0, adIndex % adBoxes.length);
                const adBox = adBoxes[adIndex];

                if (adBox && adBox.cta && adBox.title) {
                    items.push(
                        <AdCard key={`ad-${items.length}`} adBox={adBox} />
                    );
                }
            }
        }

        return items;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-4 gap-x-2 md:gap-5 2xl:gap-8 pb-4 md:pb-12">
            {renderItemsWithAds()}
            {hasNextPage && (
                <div ref={ref} className="col-span-full h-10 flex items-center justify-center postloader">
                    {isLoading && (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                            <p className="text-sm text-gray-600">Loading more posts...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 