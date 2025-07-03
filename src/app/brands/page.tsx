import MarketingAgency from 'app/components/MarketingAgency';
import InfiniteScrollBrands from '../components/InfiniteScrollBrands';
import { getBrandCategoriesData, getBrandPageData, getBrandsData } from '../lib/queries';
import { Metadata } from 'next';
import { client } from 'app/lib/apollo-client';
import { gql } from '@apollo/client';

// Force dynamic rendering to prevent build-time GraphQL calls
export const dynamic = 'force-dynamic';

const GET_BRANDS_PAGE_METADATA = gql`
  query GetBrandsPageMetadata {
    page(id: "brands", idType: URI) {
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data } = await client.query({
            query: GET_BRANDS_PAGE_METADATA,
        });

        const seo = data?.page?.seo;

        return {
            title: seo?.title || 'Brands',
            description: seo?.metaDesc || 'Explore our collection of brands',
            openGraph: {
                title: seo?.opengraphTitle || 'Brands',
                description: seo?.opengraphDescription || 'Explore our collection of brands',
                images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
            },
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
        const { brands, hasNextPage, endCursor } = await getBrandsData();
        const { brandCategories } = await getBrandCategoriesData();
        const { brandPage } = await getBrandPageData();

        return (
            <>
                <div className="md:px-4">
                    <div className="container">
                        <div className="text-center pt-8 pb-12 md:py-20 max-w-4xl w-full m-auto space-y-2">
                            <h1>{brandPage?.brandTitle || 'Brands'}</h1>
                            <p className="text-center text-base md:text-1xl font-normal w-full m-auto pt-4 text-theme-text-2">{brandPage?.brandText || 'Explore our collection of brands'}</p>
                        </div>
                    </div>
                </div>

                <InfiniteScrollBrands
                    initialBrands={brands || []}
                    hasNextPage={hasNextPage}
                    endCursor={endCursor}
                    brandCategories={brandCategories || []}
                />

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
