import { NextResponse } from 'next/server';
import { filterBrandsByCategory } from '../../../lib/queries';

export async function POST(request: Request) {
    try {
        const { category } = await request.json();
        console.log('API brands category filter request - category:', category);

        if (!category || category.trim() === '') {
            return NextResponse.json({
                brands: { nodes: [], pageInfo: { hasNextPage: false, endCursor: '' } },
                message: 'No category provided'
            });
        }

        const { brands } = await filterBrandsByCategory(category);

        console.log('API Category filter results count:', brands.length);
        console.log('API Category filter results:', brands.map((brand: { title: string; slug: string }) => ({ title: brand.title, slug: brand.slug })));
        console.log('API Category filter raw response:', brands);

        const responseData = {
            brands: {
                nodes: brands,
                pageInfo: {
                    hasNextPage: false, // For category results, we don't need pagination
                    endCursor: ''
                }
            }
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error filtering brands by category:', error);
        return NextResponse.json({
            error: 'Failed to filter brands by category',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 