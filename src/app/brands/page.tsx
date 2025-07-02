import MarketingAgency from 'app/components/MarketingAgency';
import BrandsSearch from './BrandsSearch';
import { getBrandCategoriesData, getBrandsData, getBrandPageData } from '../lib/queries';
import { Metadata } from 'next';
import { client } from 'app/lib/apollo-client';
import { GET_BRANDS_QUERY } from '../lib/queries';

// Force dynamic rendering to prevent build-time GraphQL calls
export const dynamic = 'force-dynamic';




export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data } = await client.query({
            query: GET_BRANDS_QUERY,
        });

        const seo = data?.page?.seo;

        return {
            title: seo?.title || 'Brands',
            description: seo?.metaDesc || '',
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Brands',
            description: 'Explore our collection of brands',
        };
    }
}

export default async function Brands() {
    try {
        const { brands } = await getBrandsData();
        const { brandCategories } = await getBrandCategoriesData();
        const { brandPage } = await getBrandPageData();

        return (
            <>
                <div className="md:px-4">
                    <div className="container">
                        <div className="text-center pt-8 pb-12 md:py-20 max-w-4xl w-full m-auto space-y-2">
                            <h1>{brandPage?.brandTitle || 'Brands'}</h1>
                            <p className="text-base md:text-1xl font-normal w-full m-auto pt-4 text-theme-text-2">{brandPage?.brandText || 'Explore our collection of brands'}</p>
                        </div>
                    </div>
                </div>

                <BrandsSearch brands={brands || []} brandCategories={brandCategories || []} />

                <MarketingAgency marketingAgency={{
                    title: '',
                    subText: '',
                    textArea: '',
                    servicesInformation: [],
                    logo: {
                        node: {
                            sourceUrl: ''
                        }
                    },
                    ratingArea: [],
                    link: {
                        url: '',
                        title: '',
                        target: ''
                    }
                }} />
            </>
        )
    } catch (error) {
        console.error('Error loading brands data:', error);
        return (
            <div className="container py-20">
                <div className="text-center text-3xl text-red-500 font-bold">
                    Unable to load brands data at this time
                </div>
            </div>
        );
    }
}
