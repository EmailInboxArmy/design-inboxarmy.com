'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import InfiniteScrollSearch from '../components/InfiniteScrollSearch';
import SearchInput from './SearchInput';
import SearchLoader from './SearchLoader';
import { client } from '../lib/apollo-client';
import { SEARCH_POSTS_PAGINATED } from '../lib/queries';

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

interface SearchResults {
    posts: {
        nodes: Post[];
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
        };
    };
}

export default function SearchPageClient() {
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const keyword = searchParams.get('keyword') || '';

    useEffect(() => {
        if (!keyword.trim()) {
            setSearchResults(null);
            setError(null);
            return;
        }

        const performSearch = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log('Executing search query with keyword:', keyword);

                const { data, errors } = await client.query({
                    query: SEARCH_POSTS_PAGINATED,
                    variables: { search: keyword.trim() },
                    errorPolicy: 'all',
                    fetchPolicy: 'network-only', // Force fresh data
                });

                console.log('Search response:', { data, errors });

                if (errors && errors.length > 0) {
                    errors.forEach((err) => {
                        console.error('GraphQL error:', err);
                    });
                    setError(errors.map((e) => e.message).join('; '));
                    return;
                }

                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setError('An error occurred while searching. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [keyword]);

    if (!keyword) {
        return (
            <div className="my-10 md:my-24">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-6">Search Email Templates</h1>
                        <p className="text-gray-600 mb-8">Enter keywords to find the perfect email template for your needs.</p>
                        <SearchInput searchKeyword="" />
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <SearchLoader keyword={keyword} />;
    }

    if (error) {
        return (
            <div className="my-10 md:my-24">
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Search Error</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <SearchInput searchKeyword={keyword} />
                    </div>
                </div>
            </div>
        );
    }

    if (!searchResults?.posts?.nodes || searchResults.posts.nodes.length === 0) {
        return (
            <div className="my-10 md:my-24">
                <div className="container">
                    <div className="mx-auto text-center">
                        <h1 className="mb-6">No results found for &ldquo;{keyword}&rdquo;</h1>
                        <p className="text-gray-600 mb-8">Try searching with different keywords or browse our email templates.</p>
                    </div>
                </div>
            </div>
        );
    }

    console.log('Found posts:', searchResults.posts.nodes.length);

    return (
        <div className="my-10 md:my-24">
            <div className="container">
                <div className="max-w-2xl mx-auto mb-8">
                    <h1 className="text-center text-2xl font-bold mb-6">Search Results for: &ldquo;{keyword}&rdquo;</h1>
                </div>
                <InfiniteScrollSearch
                    initialPosts={searchResults.posts.nodes}
                    hasNextPage={searchResults.posts.pageInfo.hasNextPage}
                    endCursor={searchResults.posts.pageInfo.endCursor}
                    searchKeyword={keyword}
                />
            </div>
        </div>
    );
} 