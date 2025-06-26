import { SEARCH_POSTS, SEARCH_POSTS_ALT, SIMPLE_SEARCH_POSTS } from '../lib/queries';
import { client } from '../lib/apollo-client';
import Link from 'next/link';
import Image from 'next/image';

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

        // Try the primary search query first
        let { data, errors } = await client.query({
            query: SEARCH_POSTS,
            variables: { search: keyword },
            errorPolicy: 'all',
        });

        console.log('Primary search response:', { data, errors }); // Debug log

        // If primary query fails, try alternative query
        if (errors && errors.length > 0) {
            console.log('Primary query failed, trying alternative query...'); // Debug log
            try {
                const altResult = await client.query({
                    query: SEARCH_POSTS_ALT,
                    variables: { search: keyword },
                    errorPolicy: 'all',
                });
                data = altResult.data;
                errors = altResult.errors || [];
                console.log('Alternative search response:', { data: altResult.data, errors: altResult.errors }); // Debug log
            } catch (altError) {
                console.error('Alternative query also failed:', altError);
                errors = (errors || []).concat(altError as Error);
            }
        }

        // If alternative query also fails, try simple query
        if (errors && errors.length > 0) {
            console.log('Alternative query failed, trying simple query...'); // Debug log
            try {
                const simpleResult = await client.query({
                    query: SIMPLE_SEARCH_POSTS,
                    variables: { search: keyword },
                    errorPolicy: 'all',
                });
                data = simpleResult.data;
                errors = simpleResult.errors || [];
                console.log('Simple search response:', { data: simpleResult.data, errors: simpleResult.errors }); // Debug log
            } catch (simpleError) {
                console.error('Simple query also failed:', simpleError);
                errors = (errors || []).concat(simpleError as Error);
            }
        }

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

        return (
            <div className="my-10 md:my-24">
                <div className="container">
                    <h1 className="text-center pb-8 md:mb-12">Search Results for: &quot;{keyword}&quot; ({data.posts.nodes.length} results)</h1>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 md:gap-5 2xl:gap-8 pb-4 md:pb-12">
                        {data.posts.nodes.map((post: Post) => (
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
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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