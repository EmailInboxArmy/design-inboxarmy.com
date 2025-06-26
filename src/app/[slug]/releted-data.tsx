import { GET_POST_WITH_TAXONOMIES } from './getPost';
import { GET_RELATED_POSTS } from './getRelatedPosts';
import { client } from '../lib/apollo-client';
import Link from 'next/link';

type Params = {
    slug: string;
};

// Define interfaces for the data structures
interface TaxonomyNode {
    id: string;
}

interface PostNode {
    id: string;
    slug: string;
    title: string;
}

interface Post {
    id: string;
    emailTypes?: {
        nodes: TaxonomyNode[];
    };
    industries?: {
        nodes: TaxonomyNode[];
    };
    seasonals?: {
        nodes: TaxonomyNode[];
    };
}

interface RelatedPostsData {
    posts?: {
        nodes: PostNode[];
    };
}

export default async function PostPage({ params }: { params: Params }) {
    const apolloClient = client;

    // 1. Fetch the main post
    const { data: postData } = await apolloClient.query({
        query: GET_POST_WITH_TAXONOMIES,
        variables: { slug: params.slug },
    });

    const post: Post = postData?.post;

    // 2. Fetch related posts using taxonomy IDs
    const { data: relatedData }: { data: RelatedPostsData } = await apolloClient.query({
        query: GET_RELATED_POSTS,
        variables: {
            excludePostId: post?.id,
            emailTypeIds: post?.emailTypes?.nodes?.map((n: TaxonomyNode) => n.id) || [],
            industryIds: post?.industries?.nodes?.map((n: TaxonomyNode) => n.id) || [],
            seasonalIds: post?.seasonals?.nodes?.map((n: TaxonomyNode) => n.id) || [],
        },
    });

    return (
        <div>

            <ul>
                {relatedData?.posts?.nodes.map((related: PostNode) => (
                    <li key={related.id}>
                        <Link href={`/${related.slug}`}>{related.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
