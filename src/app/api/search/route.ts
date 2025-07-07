import { NextResponse } from 'next/server';
import { client } from '../../lib/apollo-client';
import { SEARCH_POSTS_PAGINATED } from '../../lib/queries';

export async function POST(request: Request) {
  try {
    const { search, after } = await request.json();

    if (!search || typeof search !== 'string') {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    const { data, errors } = await client.query({
      query: SEARCH_POSTS_PAGINATED,
      variables: { search: search.trim(), after },
      errorPolicy: 'all',
      fetchPolicy: 'network-only', // Force fresh data
    });

    if (errors && errors.length > 0) {
      console.error('GraphQL errors:', errors);
      return NextResponse.json({ error: 'GraphQL query failed', details: errors }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({
      error: 'Failed to fetch search results',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 