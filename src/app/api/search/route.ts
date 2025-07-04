import { NextResponse } from 'next/server';
import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client';

const SEARCH_POSTS_PAGINATED = gql`
  query SearchQueryPaginated($search: String!, $after: String) {
    posts(
      where: { 
        metaQuery: {metaArray: [{key: "content", value: $search, compare: LIKE}]}
        orderby: { field: DATE, order: DESC }
      },
      first: 50,
      after: $after
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        emailTypes {
          nodes {
            name
            slug
          }
        }
        industries {
          nodes {
            name
            slug
          }
        }
        seasonals {
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
        const { search, after } = await request.json();

        if (!search || typeof search !== 'string') {
            return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
        }

        const { data } = await client.query({
            query: SEARCH_POSTS_PAGINATED,
            variables: { search: search.trim(), after },
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching search results:', error);
        return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
    }
} 