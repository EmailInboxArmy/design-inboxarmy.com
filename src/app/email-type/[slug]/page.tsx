import { client } from '../../lib/apollo-client';
import { gql } from '@apollo/client'
import InfiniteScrollTemplates from '../../components/InfiniteScrollTemplates';
//import { getCategoriesData } from '../../lib/categories';
import MarketingAgency from "app/components/MarketingAgency";
import { Params } from 'next/dist/server/request/params';
import { getBrandData } from '../../lib/queries';
import { Metadata } from 'next';

// Force dynamic rendering to prevent build-time GraphQL calls
export const dynamic = 'force-dynamic';

const GET_EMAIL_TYPE_SEO_BY_SLUG = gql`
query EmailTemplate($slug: [String]) {
    emailTypes(where: { slug: $slug }) {
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

// Email Type By Slug
const GET_EMAIL_TYPE_BY_SLUG = gql`
  query EmailTemplate($slug: [String]) {
    emailTypes(where: { slug: $slug }) {
      nodes {
        id
        name
        slug
        description
        posts(first: 24, where: { parent: null }) {
          nodes {
            title
            slug
            uri
            featuredImage {
              node {
                sourceUrl
              }
            }
            postdata {
              brand {
                nodes {
                  slug
                  ... on Brand {
                    id
                    brandCategories(first: 1) {
                      nodes {
                        name
                      }
                    }
                  }
                }
              }
            }
            emailTypes(first: 50, where: { parent: null }) {
              nodes {
                name
              }
            }
            industries(first: 50, where: { parent: null }) {
              nodes {
                name
              }
            }
            seasonals(first: 50, where: { parent: null }) {
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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const resolvedParams = await params;
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug as string);
  } catch {
    decodedSlug = resolvedParams.slug as string;
  }

  const { data } = await client.query({
    query: GET_EMAIL_TYPE_SEO_BY_SLUG,
    variables: {
      slug: [decodedSlug],
    },
  });

  const seo = data?.emailTypes?.nodes?.[0]?.seo;

  return {
    title: seo?.title || 'Email Type Page',
    description: seo?.metaDesc || '',
    openGraph: {
      title: seo?.opengraphTitle || seo?.title || 'Email Type Page',
      description: seo?.opengraphDescription || seo?.metaDesc || '',
      images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
    },
  };
}

export const revalidate = 10;

export default async function EmailTypePage({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug as string);
  } catch {
    decodedSlug = resolvedParams.slug as string;
  }

  const { data } = await client.query({
    query: GET_EMAIL_TYPE_BY_SLUG,
    fetchPolicy: 'no-cache',
    variables: {
      slug: [decodedSlug], // pass slug as array
    },

  });

  const emailTypeNode = data.emailTypes?.nodes?.[0];
  //const categoriesData = await getCategoriesData();

  // If no data is found, show message
  if (!emailTypeNode) {
    return (
      <div className="container py-20">
        <div className="text-center text-3xl text-red-500 font-bold">
          Data not found
        </div>
      </div>
    );
  }

  const { adBoxes } = await getBrandData();

  return (

    <div className="page-email-type">
      <div className="container">
        <div className="text-center py-10 md:py-20 max-w-6xl w-full m-auto">
          <h1 className="leading-tight tracking-tight pb-6 pt-4 md:py-5 block">{emailTypeNode?.name} Email Inspiration</h1>
          <p className="p2 w-full m-auto pt-2 text-theme-text-2">{emailTypeNode?.description}</p>
        </div>
      </div>

      <div className="pt-4 pb-6 px-4 xl:px-12 md:pt-6">
        <InfiniteScrollTemplates
          initialTemplates={emailTypeNode?.posts?.nodes || []}
          hasNextPage={emailTypeNode?.posts?.pageInfo.hasNextPage}
          endCursor={emailTypeNode?.posts?.pageInfo.endCursor}
          adBoxes={adBoxes}
          activeTagSlug={decodedSlug}
          filterType="emailType"
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
