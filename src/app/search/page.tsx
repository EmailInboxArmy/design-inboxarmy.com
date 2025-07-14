import InfiniteScrollSearch from '../components/InfiniteScrollSearch';
import Pagination from '../components/Pagination';
import { Post } from '../types/post';
import { notFound } from 'next/navigation';

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

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ keyword?: string; page?: string }>;
}) {
    const params = await searchParams;
    const keyword = params.keyword?.trim() || '';
    const page = parseInt(params.page || '1', 10);

    if (!keyword) return notFound();

    try {
        // Use the new REST API endpoint
        const response = await fetch(
            `https://design-backend.inboxarmy.com/wp-json/custom/v1/search-posts?keyword=${encodeURIComponent(keyword)}&page=${page}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 60 }, // Cache for 60 seconds
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        // Transform the data to match the expected Post interface
        // The API returns { nodes: [...], pagination: {...} }
        const results: Post[] = Array.isArray(data.nodes)
            ? data.nodes.map((item: ApiPostItem) => {
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

                return {
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
                };
            })
            : [];

        // Get pagination info from API response
        const pagination = data.pagination || {};
        const totalPages = parseInt(pagination.total_pages) || 1;
        const currentPage = parseInt(pagination.current_page) || 1;
        const totalPosts = parseInt(pagination.total_posts) || results.length;

        // Check if there's a next page
        const hasNextPage = currentPage < totalPages;

        console.log('Transformed results:', {
            resultsCount: results.length,
            totalPages,
            currentPage,
            totalPosts,
            hasNextPage
        });

        return (
            <div className="relative">
                <div className="my-10 md:my-24">
                    <div className="container">
                        <div className="max-w-2xl mx-auto mb-4">
                            <h1 className="text-center mb-6">Search Results for:</h1>
                            <p className="h3 text-center mb-4">&ldquo;{keyword}&rdquo;</p>

                        </div>

                        {results.length > 0 ? (
                            <>
                                <InfiniteScrollSearch
                                    initialPosts={results}
                                    hasNextPage={hasNextPage}
                                    endCursor={currentPage.toString()}
                                    searchKeyword={keyword}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />

                                {/* Only show pagination if we have multiple pages */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        baseUrl="/search"
                                        searchParams={{ keyword }}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="text-center my-4">
                                <h2 className="text-xl font-semibold mb-4">No results found</h2>
                                <p className="text-gray-600">Try searching with different keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Search error:', error);
        return (
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Search Error</h1>
                <p>Something went wrong while fetching the results. Please try again.</p>
            </div>
        );
    }
}
