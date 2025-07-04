import { SEARCH_POSTS_PAGINATED } from '../lib/queries';
import { client } from '../lib/apollo-client';
import InfiniteScrollSearch from '../components/InfiniteScrollSearch';



export type PageProps = {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const keyword = typeof searchParams.keyword === 'string' ? searchParams.keyword.trim() : '';

    console.log('Search keyword:', keyword); // Debug log

    if (!keyword) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">No keyword provided.</h1>
                <p className="text-gray-600">Please enter a search term to find email templates.</p>
            </div>
        );
    }

    try {
        console.log('Executing search query with keyword:', keyword); // Debug log

        // Use the paginated search query to get first 50 results
        const { data, errors } = await client.query({
            query: SEARCH_POSTS_PAGINATED,
            variables: { search: keyword },
            errorPolicy: 'all',
            context: {
                fetchOptions: {
                    next: { revalidate: 10 }
                }
            }
        });

        console.log('Search response:', { data, errors }); // Debug log

        // Check for GraphQL errors
        if (errors && errors.length > 0) {
            console.error('GraphQL errors:', errors);
            return (
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Search Error</h1>
                    <p className="text-gray-600">There was an error with the search query. Please try again.</p>
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-gray-500">Error details</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{JSON.stringify(errors, null, 2)}</pre>
                    </details>
                </div>
            );
        }

        if (!data?.posts?.nodes || data.posts.nodes.length === 0) {
            return (
                <div className="px-6 py-40 text-center w-full">
                    <div className="h2 mb-4">No results found for &quot;{keyword}&quot;</div>
                    <p className="text-gray-600">Try searching with different keywords or browse our email templates.</p>
                </div>
            );
        }

        console.log('Found posts:', data.posts.nodes.length); // Debug log

        // Use the InfiniteScrollSearch component for pagination
        return (
            <InfiniteScrollSearch
                initialPosts={data.posts.nodes}
                hasNextPage={data.posts.pageInfo.hasNextPage}
                endCursor={data.posts.pageInfo.endCursor}
                searchKeyword={keyword}
            />
        );
    } catch (error) {
        console.error('Search error:', error);
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">An error occurred while searching.</h1>
                <p className="text-gray-600 mb-4">Please try again later or contact support if the problem persists.</p>
                <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-500">Error details</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">{error instanceof Error ? error.message : String(error)}</pre>
                </details>
            </div>
        );
    }
}