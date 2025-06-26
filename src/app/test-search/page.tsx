import { client } from '../lib/apollo-client';
import { gql } from '@apollo/client';
import Link from 'next/link';

const TEST_QUERY = gql`
  query TestQuery {
    posts(first: 5) {
      nodes {
        id
        title
        slug
      }
    }
  }
`;

interface TestPost {
    id: string;
    title: string;
    slug: string;
}

export default async function TestSearchPage() {
    try {
        console.log('Testing GraphQL connection...');

        const { data, errors } = await client.query({
            query: TEST_QUERY,
            errorPolicy: 'all',
        });

        console.log('Test query result:', { data, errors });

        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">GraphQL Test Page</h1>

                {errors && errors.length > 0 ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <h2 className="font-bold">GraphQL Errors:</h2>
                        <pre className="mt-2 text-sm">{JSON.stringify(errors, null, 2)}</pre>
                    </div>
                ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        <h2 className="font-bold">GraphQL Connection Successful!</h2>
                        <p>Found {data?.posts?.nodes?.length || 0} posts</p>
                    </div>
                )}

                {data?.posts?.nodes && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Sample Posts:</h2>
                        <ul className="list-disc list-inside">
                            {data.posts.nodes.map((post: TestPost) => (
                                <li key={post.id} className="mb-1">
                                    {post.title} (ID: {post.id})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6">
                    <Link href="/search?keyword=test" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Test Search with &quot;test&quot; keyword
                    </Link>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Test page error:', error);

        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">GraphQL Test Page - Error</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <h2 className="font-bold">Connection Error:</h2>
                    <pre className="mt-2 text-sm">{error instanceof Error ? error.message : String(error)}</pre>
                </div>
            </div>
        );
    }
} 