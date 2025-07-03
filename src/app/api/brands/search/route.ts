import { NextResponse } from 'next/server';
import { client } from '../../../lib/apollo-client';
import { gql } from '@apollo/client';

const SEARCH_BRANDS_QUERY = gql`
  query SearchBrands($search: String!) {
    brands(
      first: 1000, 
      where: { 
        search: $search,
        orderby: { field: TITLE, order: ASC }
      }
    ) {
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
    const { search } = await request.json();
    console.log('API brands search request - search:', search);

    if (!search || search.trim() === '') {
      return NextResponse.json({
        brands: { nodes: [], pageInfo: { hasNextPage: false, endCursor: '' } },
        message: 'No search term provided'
      });
    }

    const { data } = await client.query({
      query: SEARCH_BRANDS_QUERY,
      variables: {
        search: search.trim()
      },
    });

    const brandsData = data?.brands?.nodes ?? [];
    console.log('API Search results count:', brandsData.length);
    console.log('API Search results:', brandsData.map((brand: { title: string; slug: string }) => ({ title: brand.title, slug: brand.slug })));

    const responseData = {
      brands: {
        nodes: brandsData,
        pageInfo: {
          hasNextPage: false, // For search results, we don't need pagination
          endCursor: ''
        }
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error searching brands:', error);
    return NextResponse.json({
      error: 'Failed to search brands',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 