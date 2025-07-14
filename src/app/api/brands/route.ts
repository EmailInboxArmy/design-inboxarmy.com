import { NextResponse } from 'next/server';
import { getBrandsWithPostsData } from '../../lib/queries';

export async function POST(request: Request) {
  try {
    const { after } = await request.json();
    console.log('API brands request - after:', after);

    const { brands, hasNextPage, endCursor } = await getBrandsWithPostsData(after);

    const responseData = {
      brands: {
        nodes: brands,
        pageInfo: {
          hasNextPage,
          endCursor
        }
      }
    };

    console.log('API brands response - brands count:', responseData?.brands?.nodes?.length || 0);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 