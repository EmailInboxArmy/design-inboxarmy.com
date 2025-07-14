import { gql } from '@apollo/client';
import Link from 'next/link';
import { client } from 'app/lib/apollo-client';
import InfiniteScrollBrandPosts from 'app/components/InfiniteScrollBrandPosts';
import { Params } from 'next/dist/server/request/params';
import { getBrandData } from 'app/lib/queries';
import Image from 'next/image';


const GET_BRAND_AND_POSTS = gql`
  query GetBrandAndPosts($id: ID!, $value: String) {
    brand(idType: SLUG, id: $id) {
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
      databaseId 
      title
      slug
      brands {
        website
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
    posts(
      first: 24,
      where: {metaQuery: {metaArray: {key: "brand", value: $value}}}
    ) {
      nodes {
        title
        slug
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }
        emailTypes(first: 1, where: {parent: null}) {
          nodes {
            name
            slug
          }
        }
        industries(first: 1, where: {parent: null}) {
          nodes {
            name
            slug
          }
        }
        seasonals(first: 1, where: {parent: null}) {
          nodes {
            name
            slug
          }
        }
        postdata {
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


 

export async function generateStaticParams() {
  // Optional: Fetch all brand slugs for SSG
  return [];
}

export const dynamicParams = true;

export default async function BrandDetail({ params }: { params: Promise<Params> }) {

  try {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug as string);

    // First fetch just the brand to get its ID
    const { data: brandData } = await client.query({
      query: gql`
        query GetBrandId($id: ID!) {
          brand(idType: SLUG, id: $id) {
            databaseId
          }
        }
      `,
      variables: { id: slug },
    });

    const brandId = brandData?.brand?.databaseId?.toString();

    if (!brandId) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Brand Not Found</h1>
            <p className="text-gray-600 mb-6">The requested brand could not be found.</p>
          </div>
        </div>
      );
    }

    // Step 2: Get brand details and posts
    const brandRes = await client.query({
      query: GET_BRAND_AND_POSTS,
      variables: {
        id: slug,
        value: brandId  // Use the dynamic brand ID here
      },
    });

    const brand = brandRes.data?.brand;

    if (!brand) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Brand Not Found</h1>
            <p className="text-gray-600 mb-6">The requested brand could not be found.</p>
          </div>
        </div>
      );
    }

    const postsData = brandRes.data?.posts;
    const posts = postsData?.nodes || [];
    const hasNextPage = postsData?.pageInfo?.hasNextPage || false;
    const endCursor = postsData?.pageInfo?.endCursor || '';
    const { adBoxes } = await getBrandData();

    console.log('Posts Data:', postsData);
    console.log('Posts:', posts);

    return (
      <>
        <div className='pt-8 md:pt-12 pb-12 md:pb-16 text-center md:text-left'>
          <div className='container'>
            <div className="flex flex-wrap items-center justify-between bg-theme-light-gold rounded-2xl p-4 xl:p-6 lg:py-8 lg:px-8 2xl:py-11">
              <div className="flex flex-wrap md:flex-nowrap items-center gap-8 md:gap-6 w-full md:w-8/12">
                <div className='w-full md:w-auto 2xl:pl-1'>
                  <div className="bg-white m-auto md:m-0 w-[150px] md:w-28 lg:w-[120px] 2xl:w-[150px] h-[150px] md:h-28 lg:h-[120px] 2xl:h-[150px] rounded-full overflow-hidden flex items-center justify-center">
                    {brand.featuredImage?.node?.sourceUrl ? (
                      <Image
                        className='w-full h-full object-cover'
                        src={brand.featuredImage.node.sourceUrl}
                        alt={brand.title || 'Brand Image'}
                        width={150}
                        height={150}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='w-full md:w-auto md:pl-2'>
                  <h1 className='text-3xl md:text-5xl 2xl:text-55xl'>{brand.title || 'Brand'}</h1>

                  <p className="text-base lg:text-1xl text-theme-text-2 mt-4 ">
                    A collection of emails built by {brand.title || 'this brand'}
                  </p>


                  
                </div>
              </div>
              <div className='w-full md:w-4/12 flex justify-center md:justify-end mt-8 md:mt-0'>
                {brand.brands?.website && (
                  <Link href={brand.brands.website} target="_blank" className="website-visit-btn text-base md:text-xl 2xl:text-1xl bg-white text-theme-text-2 px-6 py-4 md:py-5 rounded-full font-medium shadow-sm hover:bg-theme-blue hover:text-white transition flex items-center gap-x-1.5">
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

        <div className="pt-4 pb-6 px-4 relative">
          {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No posts found for this brand.
            </div>
          ) : (
            <>
              <InfiniteScrollBrandPosts
                initialTemplates={posts}
                hasNextPage={hasNextPage}
                endCursor={endCursor}
                adBoxes={adBoxes}
                brandId={brandId}
              />
            </>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching brand posts:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Brand Posts</h1>
          <p className="text-gray-600 mb-6">Please check back later.</p>
          <p className="text-sm text-gray-500">Error details: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
}
