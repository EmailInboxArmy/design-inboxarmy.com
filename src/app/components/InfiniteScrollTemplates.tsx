'use client';

import { useEffect, useState, useCallback } from 'react';
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
                id: string;
                brandCategories: {
                    nodes: {
                        name: string;
                    }[];
                }
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

interface RequestBody {
    after: string;
    emailTypeSlug?: string;
    industrySlug?: string;
    seasonalSlug?: string;
    [key: string]: string | number | boolean | undefined;
}

interface InfiniteScrollTemplatesProps {
    initialTemplates: Template[];
    hasNextPage: boolean;
    endCursor: string;
    adBoxes: AdBox[];
    activeTagSlug?: string;
    filterType?: 'emailType' | 'industry' | 'seasonal';
    apiEndpoint?: string;
    apiParams?: Record<string, string | number | boolean>;
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

export default function InfiniteScrollTemplates({
    initialTemplates,
    hasNextPage: initialHasNextPage,
    endCursor: initialEndCursor,
    adBoxes,
    activeTagSlug,
    filterType,
    apiEndpoint = '/api/templates',
    apiParams = {}
}: InfiniteScrollTemplatesProps) {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [endCursor, setEndCursor] = useState(initialEndCursor);
    const [isLoading, setIsLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    const loadMoreTemplates = useCallback(async () => {
        if (inView) {
            setIsLoading(true);
            try {
                // Prepare request body based on filter type
                const requestBody: RequestBody = {
                    after: endCursor,
                    ...apiParams,
                };

                if (activeTagSlug && filterType) {
                    switch (filterType) {
                        case 'emailType':
                            requestBody.emailTypeSlug = activeTagSlug;
                            break;
                        case 'industry':
                            requestBody.industrySlug = activeTagSlug;
                            break;
                        case 'seasonal':
                            requestBody.seasonalSlug = activeTagSlug;
                            break;
                    }
                }

                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.posts) {
                    setTemplates(prev => [...prev, ...data.posts.nodes]);
                    setHasNextPage(data.posts.pageInfo.hasNextPage);
                    setEndCursor(data.posts.pageInfo.endCursor);
                }
            } catch (error) {
                console.error('Error loading more templates:', error);
            } finally {
                setIsLoading(false);
            }
            console.log('inView', inView);
            console.log('endCursor', endCursor);
            console.log('hasNextPage', hasNextPage);
            console.log('templates', templates);
        }
    }, [inView, endCursor, templates, hasNextPage, apiEndpoint, apiParams, activeTagSlug, filterType]);

    useEffect(() => {
        loadMoreTemplates();
    }, [loadMoreTemplates]);

    // Function to render items with ads at specific positions: 6, 12, 24, 36, 48, etc.
    const renderItemsWithAds = () => {
        const items = [];

        for (let i = 0; i < templates.length; i++) {
            // Add the email template
            items.push(
                <EmailCard
                    key={`template-${templates[i].title}-${i}`}
                    title={templates[i].title}
                    image={templates[i].featuredImage?.node?.sourceUrl || ''}
                    slug={templates[i].slug}
                    postdata={templates[i].postdata}
                    template={templates[i] as Template & {
                        emailTypes: { nodes: { name: string, slug: string }[] };
                        industries: { nodes: { name: string, slug: string }[] };
                        seasonals: { nodes: { name: string, slug: string }[] };
                        brand: { nodes: { name: string, slug: string, brandCategories: { nodes: { name: string } } }[] };
                    }}
                    activeTagSlug={activeTagSlug}
                />
            );

            // Add ad at specific positions: 5, 12, then every 12 after that (24, 36, 48, etc.)
            const position = i + 1;
            const shouldShowAd = position === 5 || (position >= 12 && position % 12 === 0);

            if (shouldShowAd && adBoxes && adBoxes.length > 0) {
                // Calculate which ad to show
                let adIndex;
                if (position === 5) {
                    adIndex = 0; // First ad at position 5
                } else if (position === 12) {
                    adIndex = 1; // Second ad at position 12
                } else {
                    // For positions 24, 36, 48, etc., cycle through ads starting from the beginning
                    adIndex = Math.floor((position / 12) - 2) % adBoxes.length;
                }

                // Ensure adIndex is valid and within bounds
                adIndex = Math.max(0, adIndex % adBoxes.length);
                const adBox = adBoxes[adIndex];

                // Only render ad if adBox exists and has required properties
                if (adBox && adBox.cta && adBox.title) {
                    items.push(
                        <AdCard
                            key={`ad-${position}-${adIndex}`}
                            adBox={adBox}
                        />
                    );
                }
            }
        }

        return items;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-4 gap-x-2 md:gap-5 2xl:gap-8 pb-4 md:pb-12 relative">
            {renderItemsWithAds()}
            {hasNextPage && (
                <div ref={ref} className="col-span-full h-10 flex items-center justify-center postloader">
                    {isLoading && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>}
                </div>
            )}
        </div>
    );
} 