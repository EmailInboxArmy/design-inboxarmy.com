import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client'
import InfiniteScrollTemplates from '../../components/InfiniteScrollTemplates';
//import { getCategoriesData } from '../../lib/categories';
import MarketingAgency from "app/components/MarketingAgency";
import { Params } from 'next/dist/server/request/params';
import { getBrandData } from 'app/lib/queries';
import { Metadata } from 'next';

const GET_SEASONAL_SEO_BY_SLUG = gql`
query Seasonal($slug: [String]) {
    seasonals(where: { slug: $slug }) {
      nodes {
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
  }
`;

// Seasonal By Slug
const GET_SEASONAL_BY_SLUG = gql`
  query SeasonalTemplate($slug: [String]) {
    seasonals(where: { slug: $slug }) {
      nodes {
        id
        name
        slug
        description
        posts(first: 75) {
          nodes {
            title
            slug
            uri
            featuredImage {
              node {
                sourceUrl
              }
            }
            emailTypes {
              nodes {
                name
              }
            }
            industries {
              nodes {
                name
              }
            }
            seasonals {
              nodes {
                name
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

export const revalidate = 10;   

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {

  const resolvedParams = await params;
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug as string);
  } catch {
    decodedSlug = resolvedParams.slug as string;
  }

  const { data } = await client.query({
    query: GET_SEASONAL_SEO_BY_SLUG,
    fetchPolicy: 'no-cache',
    variables: {
      slug: [decodedSlug],
    },
   
  });

  const seo = data?.seasonals?.nodes?.[0]?.seo;

  return {
    title: seo?.title || 'Seasonal Page',
    description: seo?.metaDesc || '',
    openGraph: {
      title: seo?.opengraphTitle || seo?.title || 'Seasonal Page',
      description: seo?.opengraphDescription || seo?.metaDesc || '',
      images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
    },
  };
}
export default async function SeasonalPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug as string);
  } catch {
    decodedSlug = resolvedParams.slug as string;
  }

  const { data } = await client.query({
    query: GET_SEASONAL_BY_SLUG,
    variables: {
      slug: [decodedSlug], // pass slug as array
    },
    context: {
      fetchOptions: {
        next: { revalidate: 10 }
      }
    }
  });

  const seasonalNode = data.seasonals?.nodes?.[0];
  //const categoriesData = await getCategoriesData();
  const { adBoxes } = await getBrandData();
  // If no data is found, show message
  if (!seasonalNode) {
    return (
      <div className="container py-20">
        <div className="text-center text-3xl text-red-500 font-bold">
          Data not found
        </div>
      </div>
    );
  }


  return (
    <div className="page-seasonal">
      <div className="container">
        <div className="text-center py-10 md:py-20 max-w-6xl w-full m-auto">
          <h1 className="leading-tight tracking-tight pb-6 pt-4 md:py-5 block">{seasonalNode?.name} Email Inspiration</h1>
          <p className="p2 w-full m-auto pt-2 text-theme-text-2">{seasonalNode?.description}</p>
        </div>
      </div>

      <div className="pt-4 pb-6 px-4 xl:px-12 md:pt-6">
        <InfiniteScrollTemplates
          initialTemplates={seasonalNode?.posts?.nodes || []}
          hasNextPage={seasonalNode?.posts?.pageInfo.hasNextPage}
          endCursor={seasonalNode?.posts?.pageInfo.endCursor}
          adBoxes={adBoxes}
          activeTagSlug={decodedSlug}
        />
      </div>

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
    </div>
  );
}
