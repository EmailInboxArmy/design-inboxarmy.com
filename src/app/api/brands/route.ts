import { NextResponse } from 'next/server';
import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client';

const BRANDS_QUERY = gql`
  query GetBrands($after: String) {
    brands(first: 600, after: $after, where: { orderby: { field: TITLE, order: ASC } }) {
      nodes {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        slug
        title
        assignedPostCount
        brandCategories(first: 600) {
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