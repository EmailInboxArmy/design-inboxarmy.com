import { NextResponse } from 'next/server';
import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client';

const EMAIL_TEMPLATES_QUERY = gql`
  query EmailTemplate($after: String, $emailTypeSlug: [String]) {
    emailTypes(where: { slug: $emailTypeSlug }) {
      nodes {
        posts(first: 24, after: $after, where: { parent: null }) {
          nodes {
            title
            slug
            uri
            featuredImage {
              node {
                sourceUrl
              }
            }
            emailTypes(first: 10, where: { parent: null }) {
              nodes {
                id
                name
                slug
              }
            }
            industries(first: 10, where: { parent: null }) {
              nodes {
                id
                name
                slug
              }
            }
            seasonals(first: 10, where: { parent: null }) {
              nodes {
                id
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
    }
  }
`;

const INDUSTRY_TEMPLATES_QUERY = gql`
  query IndustryTemplate($after: String, $industrySlug: [String]) {
    industries(where: { slug: $industrySlug }) {
      nodes {
        posts(first: 24, after: $after, where: { parent: null }) {
          nodes {
            title
            slug
            uri
            featuredImage {
              node {
                sourceUrl
              }
            }
            emailTypes(first: 10, where: { parent: null }) {
              nodes {
                id
                name
                slug
              }
            }
            industries(first: 10, where: { parent: null }) {
              nodes {
                id
                name
                slug
              }
            }
            seasonals(first: 10, where: { parent: null }) {
              nodes {
                id
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
    }
  }
`;

const SEASONAL_TEMPLATES_QUERY = gql`
  query SeasonalTemplate($after: String, $seasonalSlug: [String]) {
    seasonals(where: { slug: $seasonalSlug }) {
      nodes {
        posts(first: 24, after: $after, where: { parent: null }) {
          nodes {
            title
            slug
            uri
            featuredImage {
              node {
                sourceUrl
              }
            }
            emailTypes(first: 10, where: { parent: null }) {
              nodes {
                id
                name
                slug
              }
            }
            industries(first: 10, where: { parent: null }) {
              nodes {
                id
                name
                slug
              }
            }
            seasonals(first: 10, where: { parent: null }) {
              nodes {
                id
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
    }
  }
`;

const GENERAL_TEMPLATES_QUERY = gql`
  query GeneralTemplates($after: String) {
    posts(first: 24, after: $after, where: { parent: null }) {
      nodes {
        title
        slug
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }
        emailTypes(first: 10, where: { parent: null }) {
          nodes {
            id
            name
            slug
          }
        }
        industries(first: 10, where: { parent: null }) {
          nodes {
            id
            name
            slug
          }
        }
        seasonals(first: 10, where: { parent: null }) {
          nodes {
            id
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
    const { after, emailTypeSlug, industrySlug, seasonalSlug } = await request.json();

    let data;

    if (emailTypeSlug) {
      // Filter by email type slug
      const result = await client.query({
        query: EMAIL_TEMPLATES_QUERY,
        variables: {
          after,
          emailTypeSlug: [emailTypeSlug]
        },
      });

      // Extract posts from the emailTypes structure
      data = { posts: result.data?.emailTypes?.nodes?.[0]?.posts };
    } else if (industrySlug) {
      // Filter by industry slug
      const result = await client.query({
        query: INDUSTRY_TEMPLATES_QUERY,
        variables: {
          after,
          industrySlug: [industrySlug]
        },
      });

      // Extract posts from the industries structure
      data = { posts: result.data?.industries?.nodes?.[0]?.posts };
    } else if (seasonalSlug) {
      // Filter by seasonal slug
      const result = await client.query({
        query: SEASONAL_TEMPLATES_QUERY,
        variables: {
          after,
          seasonalSlug: [seasonalSlug]
        },
      });

      // Extract posts from the seasonals structure
      data = { posts: result.data?.seasonals?.nodes?.[0]?.posts };
    } else {
      // General template browsing (no filter)
      const result = await client.query({
        query: GENERAL_TEMPLATES_QUERY,
        variables: { after },
      });

      data = result.data;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({
      error: 'Failed to fetch templates',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 