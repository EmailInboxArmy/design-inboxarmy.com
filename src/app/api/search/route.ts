import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { search, after, page } = await request.json();

    if (!search || typeof search !== 'string') {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    // Use the new REST API endpoint
    const pageParam = page || (after ? parseInt(after) + 1 : 1);
    const url = `https://design-backend.inboxarmy.com/wp-json/custom/v1/search-posts?keyword=${encodeURIComponent(search.trim())}&page=${pageParam}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data in the expected format for the frontend
    const transformedData = {
      posts: {
        nodes: Array.isArray(data.nodes) ? data.nodes : [],
        pageInfo: {
          hasNextPage: data.pagination ? data.pagination.current_page < data.pagination.total_pages : false,
          endCursor: pageParam.toString()
        }
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({
      error: 'Failed to fetch search results',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 