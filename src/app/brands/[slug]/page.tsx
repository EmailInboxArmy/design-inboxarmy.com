import MarketingAgency from 'app/components/MarketingAgency';
import { gql } from '@apollo/client';
import { client } from 'app/lib/apollo-client';
import InfiniteScrollTemplates from 'app/components/InfiniteScrollTemplates';
import { getBrandData } from 'app/lib/queries';
import { Params } from 'next/dist/server/request/params';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

// Get brand info and all posts, then filter
const GET_BRAND_AND_POSTS_QUERY = gql`
  query GetBrandAndPosts($slug: ID!) {
    brand(id: $slug, idType: SLUG) {
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
      id
      title
      slug
      brands {
        brandIntroduction
        website
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
    posts(first: 100) {
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
            slug
          }
        }
        industries {
          nodes {
            name
            slug
          }
        }
        seasonals {
          nodes {
            name
            slug
          }
        }
        brandposts {
          brand {
            nodes {
              slug
              ... on Brand {
                title
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
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
    query: GET_BRAND_AND_POSTS_QUERY,
    variables: { slug: decodedSlug },
  });

  const seo = data?.brand?.seo;

  return {
    title: seo?.title || 'Brand Page',
  };
}

export default async function BrandDetail({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  let decodedSlug: string;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug as string);
  } catch {
    decodedSlug = resolvedParams.slug as string;
  }

  try {
    // Execute the GraphQL query to get brand and posts
    const { data } = await client.query({
      query: GET_BRAND_AND_POSTS_QUERY,
      variables: {
        slug: decodedSlug,
      },
    });

    const brandInfo = data.brand;
    const allPosts = data.posts?.nodes || [];

    // Filter posts that belong to this brand using the brandposts field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const brandPosts = allPosts.filter((post: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      post.brandposts?.brand?.nodes?.some((brand: any) => brand.slug === decodedSlug)
    );

    // Get ad boxes data
    const brandData = await getBrandData();

    // If no brand data is found, show message
    if (!brandInfo) {
      return (
        <div className="container py-20">
          <div className="text-center text-3xl text-red-500 font-bold">
            Brand not found
          </div>
        </div>
      );
    }

    return (
      <>
        <div className='pt-8 md:pt-12 pb-12 md:pb-16 text-center md:text-left'>
          <div className='container'>
            <div className="flex flex-wrap items-center justify-between bg-theme-light-gold rounded-2xl p-6 lg:py-11 lg:px-11">
              <div className="flex flex-wrap md:flex-nowrap items-center gap-8 md:gap-6 w-full md:w-8/12">
                <div className='w-full md:w-auto 2xl:pl-1'>
                  <div className="bg-white m-auto md:m-0 w-[150px] md:w-28 lg:w-[150px] h-[150px] md:h-28 lg:h-[150px] rounded-full overflow-hidden flex items-center justify-center">
                    <Image className='w-full h-full object-cover' src={brandInfo.featuredImage.node.sourceUrl} alt={brandInfo.title} width={150} height={150} />
                  </div>
                </div>

                <div className='w-full md:w-auto md:pl-2'>
                  <h1>{brandInfo.title}</h1>
                  {brandInfo.brands.brandIntroduction && (
                    <p className="text-base lg:text-1xl text-theme-text-2 mt-4 ">
                      {brandInfo.brands.brandIntroduction}
                    </p>
                  )}
                </div>
              </div>
              <div className='w-full md:w-4/12 flex justify-center md:justify-end mt-8 md:mt-0'>
                {brandInfo.brands.website && (
                  <Link href={brandInfo.brands.website} target="_blank" className="website-visit-btn text-base lg:text-1xl bg-white text-theme-text-2 px-6 py-4 md:py-5 rounded-full font-medium shadow-sm hover:bg-theme-blue hover:text-white transition flex items-center gap-x-1.5">
                    Visit Website
                    <span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.961857 10.2333C0.668964 10.5262 0.668964 11.0011 0.961857 11.294C1.25475 11.5869 1.72962 11.5869 2.02252 11.294L0.961857 10.2333ZM11.75 1.25586C11.75 0.841646 11.4142 0.50586 11 0.50586H4.25C3.83579 0.50586 3.5 0.841646 3.5 1.25586C3.5 1.67007 3.83579 2.00586 4.25 2.00586L10.25 2.00586L10.25 8.00586C10.25 8.42007 10.5858 8.75586 11 8.75586C11.4142 8.75586 11.75 8.42007 11.75 8.00586V1.25586ZM1.49219 10.7637L2.02252 11.294L11.5303 1.78619L11 1.25586L10.4697 0.725529L0.961857 10.2333L1.49219 10.7637Z" fill="#5B5B5B" />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="pt-4 pb-6 px-4 xl:px-12 md:pt-6">
          <InfiniteScrollTemplates
            initialTemplates={brandPosts}
            hasNextPage={false} // Since we're filtering client-side, no pagination for now
            endCursor={''}
            adBoxes={brandData?.adBoxes || []}
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
      </>
    );
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return (
      <div className="container py-20">
        <div className="text-center text-3xl text-red-500 font-bold">
          Error loading brand data
        </div>
      </div>
    );
  }
}