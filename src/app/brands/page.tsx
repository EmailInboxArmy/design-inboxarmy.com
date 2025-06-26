import MarketingAgency from 'app/components/MarketingAgency';
import BrandsSearch from './BrandsSearch';
import { getBrandCategoriesData, getBrandsData, getBrandPageData } from '../lib/queries';
import { Metadata } from 'next';
import { client } from 'app/lib/apollo-client';
import { GET_BRANDS_QUERY } from '../lib/queries';




export async function generateMetadata(): Promise<Metadata> {
    const { data } = await client.query({
        query: GET_BRANDS_QUERY,
    });

    const seo = data?.page?.seo;

    return {
        title: seo?.title || 'Brands',
        description: seo?.metaDesc || '',
    };
}

export default async function Brands() {
    const { brands } = await getBrandsData();
    const { brandCategories } = await getBrandCategoriesData();
    const { brandPage } = await getBrandPageData();
    return (
        <>
            <div className="md:px-4">
                <div className="container">
                    <div className="text-center pt-8 pb-12 md:py-20 max-w-4xl w-full m-auto space-y-2">
                        <h1>{brandPage?.brandTitle}</h1>
                        <p className="text-base md:text-1xl font-normal w-full m-auto pt-4 text-theme-text-2">{brandPage?.brandText}</p>
                    </div>
                </div>
            </div>

            <BrandsSearch brands={brands} brandCategories={brandCategories} />

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
}
