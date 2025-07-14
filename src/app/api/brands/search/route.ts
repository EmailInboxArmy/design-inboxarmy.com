import { NextResponse } from 'next/server';
import { searchBrandsWithPosts } from '../../../lib/queries';

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

    const { brands } = await searchBrandsWithPosts(search);

    console.log('API Search results count:', brands.length);
    console.log('API Search results:', brands.map((brand: { title: string; slug: string }) => ({ title: brand.title, slug: brand.slug })));

    const responseData = {
      brands: {
        nodes: brands,
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