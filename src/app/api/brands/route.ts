import { NextResponse } from 'next/server';
import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client';

const BRANDS_QUERY = gql`
  query GetBrands($after: String) {
    brands(first: 30, after: $after) {
      nodes {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        slug
        title
        brandCategories {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function POST(request: Request) {
    try {
        const { after } = await request.json();
        console.log('API brands request - after:', after);

        const { data } = await client.query({
            query: BRANDS_QUERY,
            variables: {
                after
            },
        });

        console.log('API brands response - brands count:', data?.brands?.nodes?.length || 0);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: 'Failed to fetch brands', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
} 