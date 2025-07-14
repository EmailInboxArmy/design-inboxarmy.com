export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    date?: string;
    featuredImage?: {
        node?: {
            sourceUrl: string;
            altText?: string;
        };
    };
    emailTypes?: {
        nodes: Array<{
            name: string;
            slug?: string;
        }>;
    };
    industries?: {
        nodes: Array<{
            name: string;
            slug?: string;
        }>;
    };
    seasonals?: {
        nodes: Array<{
            name: string;
            slug?: string;
        }>;
    };
} 