import { NextResponse } from 'next/server';
import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client';

const BRAND_POSTS_QUERY = gql`
  query BrandPosts($after: String, $brandId: String) {
    posts(
      first: 24,
      after: $after,
      where: {metaQuery: {metaArray: {key: "brand", value: $brandId}}}
    ) {
      nodes {
        title
        slug
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }
        emailTypes(first: 1, where: {parent: 0}) {
          nodes {
            name
            slug
          }
        }
        industries(first: 1, where: {parent: 0}) {
          nodes {
            name
            slug
          }
        }
        seasonals(first: 1, where: {parent: 0}) {
          nodes {
            name
            slug
          }
        }
        postdata {
          brand {
            nodes {
              slug
              ... on Brand {
                id
                title
                brandCategories(first: 1) {
                  nodes {
                    name
                  }
                }
              }
            }
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
    const { after, brandId } = await request.json();

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
    }

    const { data } = await client.query({
      query: BRAND_POSTS_QUERY,
      variables: { after, brandId },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching brand posts:', error);
    return NextResponse.json({ error: 'Failed to fetch brand posts' }, { status: 500 });
  }
} 