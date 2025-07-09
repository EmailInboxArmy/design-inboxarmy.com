import { client } from '../lib/apollo-client';
import { gql } from '@apollo/client';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import CategoryeScript from './category-script';
import './category-detail.css';
import CodeView from './CodeView';
import BodyClassHandler from '../components/BodyClassHandler';

import Image from 'next/image';
import DateIcon from '../images/date-icon.svg';
import Link from 'next/link';
import RecentPostData from './RecentPostData';
import MarketingAgency from 'app/components/MarketingAgency';
import EmailShadowPreview from './ShowEmail';
import HtmlToImageConverter from '../components/HtmlToImageConverter';
import DownloadImageButton from '../components/DownloadImageButton';

const POST_QUERY = gql`
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
        title
        date
        postdata {
            content
            brand {
                nodes {
                ... on Brand {
                    id
                    title
                    slug
                    featuredImage {
                    node {
                        sourceUrl
                    }
                    }
                }
                }
            }
        }
        featuredImage {
            node {
            sourceUrl
            altText
            }
        }
        emailTypes(first: 30) {
            nodes {
            id
            name
            slug
            }
        }
        industries(first: 30) {
            nodes {
            id
            name
            slug
            }
        }
        seasonals(first: 30) {
            nodes {
            id
            name
            slug
            }
        }
    }
  }
`;

// Alternative query using posts with name filter
const POSTS_QUERY = gql`
  query GetPosts($slug: String!) {
    posts(where: { name: $slug }, first: 1) {
      nodes {
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        emailTypes(first: 30) {
          nodes {
            id
            name
            slug
          }
        }
        industries(first: 30) {
          nodes {
            id
            name
            slug
          }
        }
        seasonals(first: 30) {
          nodes {
            id
            name
            slug
          }
        }
        postdata {
          content
          brand {
              nodes {
              ... on Brand {
                  id
                  title
                  slug
                  featuredImage {
                  node {
                      sourceUrl
                  }
                  }
              }
            }
          }
        }
      }
    }
  }
`;

// Memoize the metadata generation
export async function generateMetadata({ params }) {

    try {
        const awaitedParams = await params;
        let decodedSlug;
        try {
            decodedSlug = decodeURIComponent(awaitedParams.slug);
        } catch (error) {
            decodedSlug = awaitedParams.slug; // fallback to original slug if decoding fails
        }

        let data;
        let post = null;
        // Try the original post query first
        try {
            const response = await client.query({
                query: POST_QUERY,
                variables: { slug: decodedSlug },
            });
            data = response.data;
            if (data.post) {
                post = data.post;
            }
        } catch (graphqlError) {
            // Try the alternative posts query
            try {
                const response2 = await client.query({
                    query: POSTS_QUERY,
                    variables: { slug: decodedSlug },
                });
                data = response2.data;
                if (data.posts && data.posts.nodes && data.posts.nodes.length > 0) {
                    post = data.posts.nodes[0];
                }
            } catch (graphqlError2) {
                // Both queries failed, but don't throw error here
                console.log('Both queries failed in generateMetadata');
            }
        }

        // Check if post exists and has required data
        if (!post || !post.title) {
            return {
                title: 'Post Not Found',
            };
        }

        // Additional validation for required fields
        if (typeof post.title !== 'string' || post.title.trim() === '') {
            return {
                title: 'Post Not Found',
            };
        }

        return {
            title: post.title,
            description: post.postdata?.content?.slice(0, 160),
        };
    } catch (error) {
        return {
            title: 'Error',
        };
    }
}

export default async function PostDetail({ params }) {

    try {
        const awaitedParams = await params;
        let decodedSlug;
        try {
            decodedSlug = decodeURIComponent(awaitedParams.slug);
        } catch (error) {
            decodedSlug = awaitedParams.slug; // fallback to original slug if decoding fails
        }

        console.log('Attempting to fetch post with slug:', decodedSlug);

        let data;
        let post = null;

        // Try the original post query first
        try {
            console.log('Trying original post query...');
            const response = await client.query({
                query: POST_QUERY,
                variables: { slug: decodedSlug },
            });
            data = response.data;
            console.log('Original query response:', data);
            if (data.post) {
                post = data.post;
                console.log('Found post with original query:', post.title);
            } else {
                console.log('No post found with original query');
            }
        } catch (graphqlError) {
            console.log('Original post query failed, trying alternative...');
            console.error('GraphQL error:', graphqlError);

            // Try the alternative posts query
            try {
                console.log('Trying alternative posts query...');
                const response2 = await client.query({
                    query: POSTS_QUERY,
                    variables: { slug: decodedSlug },
                });
                data = response2.data;
                console.log('Alternative query response:', data);
                if (data.posts && data.posts.nodes && data.posts.nodes.length > 0) {
                    post = data.posts.nodes[0];
                    console.log('Found post with alternative query:', post.title);
                } else {
                    console.log('No posts found with alternative query');
                }
            } catch (graphqlError2) {
                console.error('Alternative query also failed:', graphqlError2);
                // Don't throw error here, just log it and continue
                console.log('Both queries failed, will redirect to 404');
            }
        }

        console.log('Final post data:', post);

        // Check if post exists and has required data
        if (!post || !post.title || !post.postdata?.content) {
            console.log('Post not found or invalid for slug:', decodedSlug);
            notFound();
        }

        // Additional validation for required fields
        if (typeof post.title !== 'string' || post.title.trim() === '') {
            console.log('Post title is empty or invalid for slug:', decodedSlug);
            notFound();
        }

        if (typeof post.postdata?.content !== 'string' || post.postdata.content.trim() === '') {
            console.log('Post content is empty or invalid for slug:', decodedSlug);
            notFound();
        }

        const formattedDate = format(new Date(post.date), "MMMM d, yyyy h:mmaaa").toLowerCase();

        // Check if there are any taxonomies available
        const hasEmailTypes = post.emailTypes?.nodes?.length > 0;
        const hasIndustries = post.industries?.nodes?.length > 0;
        const hasSeasonals = post.seasonals?.nodes?.length > 0;
        const hasAnyTaxonomy = hasEmailTypes || hasIndustries || hasSeasonals;

        return (
            <>
                <BodyClassHandler classname='page-category-detail' />
                <span className='absolute top-0 left-0 w-full h-[100px] bg-theme-light-gray z-10 hidden xl:block'></span>
                <div className='bg-theme-light-gray'>

                    <CategoryeScript>
                        <main className="email-wrapper pb-10 md:py-16 md:pb-10 xl:py-24 desktopmode xl:px-4">
                            <div className="container">
                                <div className='flex flex-wrap items-start mx-auto md:max-w-4xl xl:max-w-full 2xl:px-20'>
                                    <div className="w-full xl:w-3/5 rounded-2xl relative px-4 md:pl-0 md:pr-2 order-2 xl:order-1">
                                        <div className='bg-theme-light-gray-2 rounded-2xl'>
                                            <header className="email-header rounded-t-2xl w-full z-20 overflow-hidden">
                                                <div className='nav-header rounded-t-2xl border border-solid border-theme-border w-full p-2 md:p-4 flex items-center justify-between flex-wrap gap-4 bg-white'>
                                                    <div className="items-center space-x-2 hidden md:flex">
                                                        <button className="desktop-button bg-transparent hover:bg-theme-blue hover:text-white flex items-center justify-center px-1 md:px-4 py-3 md:py-2 rounded-lg whitespace-nowrap border-none text-base left-button active">
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.66675 16.5098H12.3334M9.00008 13.1764V16.5098M4.66675 13.1764H13.3334C14.7336 13.1764 15.4336 13.1764 15.9684 12.9039C16.4388 12.6643 16.8212 12.2818 17.0609 11.8114C17.3334 11.2766 17.3334 10.5766 17.3334 9.17643V5.50977C17.3334 4.10963 17.3334 3.40957 17.0609 2.87479C16.8212 2.40438 16.4388 2.02193 15.9684 1.78225C15.4336 1.50977 14.7336 1.50977 13.3334 1.50977H4.66675C3.26661 1.50977 2.56655 1.50977 2.03177 1.78225C1.56136 2.02193 1.17891 2.40438 0.939231 2.87479C0.666748 3.40957 0.666748 4.10963 0.666748 5.50977V9.17643C0.666748 10.5766 0.666748 11.2766 0.939231 11.8114C1.17891 12.2818 1.56136 12.6643 2.03177 12.9039C2.56655 13.1764 3.26661 13.1764 4.66675 13.1764Z" stroke="#5B5B5B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <span className="pl-2 font-medium">Desktop</span>
                                                        </button>
                                                        <button className="mobile-button bg-transparent hover:bg-theme-blue hover:text-white flex items-center justify-center px-1 md:px-4 py-3 md:py-2 rounded-lg whitespace-nowrap border-none text-base left-button">
                                                            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M7.00008 13.5934H7.00842M3.83341 17.3434H10.1667C11.1002 17.3434 11.5669 17.3434 11.9234 17.1618C12.237 17.002 12.492 16.747 12.6517 16.4334C12.8334 16.0769 12.8334 15.6102 12.8334 14.6768V3.34342C12.8334 2.41 12.8334 1.94329 12.6517 1.58677C12.492 1.27317 12.237 1.0182 11.9234 0.858416C11.5669 0.676758 11.1002 0.676758 10.1667 0.676758H3.83341C2.9 0.676758 2.43328 0.676758 2.07676 0.858416C1.76316 1.0182 1.50819 1.27317 1.34841 1.58677C1.16675 1.94329 1.16675 2.41001 1.16675 3.34342V14.6768C1.16675 15.6102 1.16675 16.0769 1.34841 16.4334C1.50819 16.747 1.76316 17.002 2.07676 17.1618C2.43328 17.3434 2.89999 17.3434 3.83341 17.3434ZM7.41675 13.5934C7.41675 13.8235 7.23016 14.0101 7.00008 14.0101C6.77 14.0101 6.58342 13.8235 6.58342 13.5934C6.58342 13.3633 6.77 13.1768 7.00008 13.1768C7.23016 13.1768 7.41675 13.3633 7.41675 13.5934Z" stroke="#5B5B5B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <span className="pl-2 font-medium">Mobile</span>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center relative">
                                                        <input id='DarkMode' type="checkbox" name='dark' />
                                                        <div className='light-mode'>
                                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12.0537 19.0098C15.9197 19.0098 19.0537 15.8758 19.0537 12.0098C19.0537 8.14377 15.9197 5.00977 12.0537 5.00977C8.18772 5.00977 5.05371 8.14377 5.05371 12.0098C5.05371 15.8758 8.18772 19.0098 12.0537 19.0098Z" fill="#00BEF2" />
                                                                <path d="M12.0537 22.9698C11.5037 22.9698 11.0537 22.5598 11.0537 22.0098V21.9298C11.0537 21.3798 11.5037 20.9298 12.0537 20.9298C12.6037 20.9298 13.0537 21.3798 13.0537 21.9298C13.0537 22.4798 12.6037 22.9698 12.0537 22.9698ZM19.1937 20.1498C18.9337 20.1498 18.6837 20.0498 18.4837 19.8598L18.3537 19.7298C17.9637 19.3398 17.9637 18.7098 18.3537 18.3198C18.7437 17.9298 19.3737 17.9298 19.7637 18.3198L19.8937 18.4498C20.2837 18.8398 20.2837 19.4698 19.8937 19.8598C19.7037 20.0498 19.4537 20.1498 19.1937 20.1498ZM4.91371 20.1498C4.65371 20.1498 4.40371 20.0498 4.20371 19.8598C3.81371 19.4698 3.81371 18.8398 4.20371 18.4498L4.33371 18.3198C4.72371 17.9298 5.35371 17.9298 5.74371 18.3198C6.13371 18.7098 6.13371 19.3398 5.74371 19.7298L5.61371 19.8598C5.42371 20.0498 5.16371 20.1498 4.91371 20.1498ZM22.0537 13.0098H21.9737C21.4237 13.0098 20.9737 12.5598 20.9737 12.0098C20.9737 11.4598 21.4237 11.0098 21.9737 11.0098C22.5237 11.0098 23.0137 11.4598 23.0137 12.0098C23.0137 12.5598 22.6037 13.0098 22.0537 13.0098ZM2.13371 13.0098H2.05371C1.50371 13.0098 1.05371 12.5598 1.05371 12.0098C1.05371 11.4598 1.50371 11.0098 2.05371 11.0098C2.60371 11.0098 3.09371 11.4598 3.09371 12.0098C3.09371 12.5598 2.68371 13.0098 2.13371 13.0098ZM19.0637 5.99977C18.8037 5.99977 18.5537 5.89977 18.3537 5.70977C17.9637 5.31977 17.9637 4.68977 18.3537 4.29977L18.4837 4.16977C18.8737 3.77977 19.5037 3.77977 19.8937 4.16977C20.2837 4.55977 20.2837 5.18977 19.8937 5.57977L19.7637 5.70977C19.5737 5.89977 19.3237 5.99977 19.0637 5.99977ZM5.04371 5.99977C4.78371 5.99977 4.53371 5.89977 4.33371 5.70977L4.20371 5.56977C3.81371 5.17977 3.81371 4.54977 4.20371 4.15977C4.59371 3.76977 5.22371 3.76977 5.61371 4.15977L5.74371 4.28977C6.13371 4.67977 6.13371 5.30977 5.74371 5.69977C5.55371 5.89977 5.29371 5.99977 5.04371 5.99977ZM12.0537 3.04977C11.5037 3.04977 11.0537 2.63977 11.0537 2.08977V2.00977C11.0537 1.45977 11.5037 1.00977 12.0537 1.00977C12.6037 1.00977 13.0537 1.45977 13.0537 2.00977C13.0537 2.55977 12.6037 3.04977 12.0537 3.04977Z" fill="#00BEF2" />
                                                            </svg>
                                                        </div>
                                                        <div className='dark-light-mode block  bg-theme-border mx-2'>
                                                        </div>
                                                        <div className='dark-mode'>
                                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M17.3981 12.102C17.3066 12.0184 17.1725 12.002 17.0632 12.0597C13.9348 13.719 10.0954 12.6153 8.32393 9.54691C6.55245 6.47852 7.51584 2.60224 10.5172 0.722085C10.6222 0.656489 10.6745 0.531818 10.6478 0.411097C10.6214 0.290179 10.5218 0.198898 10.3991 0.18329C8.45433 -0.0666466 6.52854 0.320014 4.82878 1.30158C2.77278 2.48804 1.30201 4.40494 0.687538 6.69823C0.0730701 8.99152 0.388405 11.3868 1.57565 13.443C2.7627 15.4992 4.67941 16.9699 6.9727 17.5844C7.73851 17.7895 8.51558 17.891 9.28772 17.891C10.8278 17.891 12.348 17.4872 13.7174 16.6965C15.4168 15.7153 16.7149 14.2406 17.4708 12.4316C17.5186 12.3174 17.4894 12.1856 17.3981 12.102Z" fill="#E0E0E0" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="code-row flex items-center space-x-2">
                                                        <button className="code-button text-xs md:text-base bg-transparent md:hover:bg-theme-blue md:hover:text-white flex items-center justify-center px-0 md:px-4 py-1 md:py-2 rounded-lg whitespace-nowrap border-none left-button mr-3 md:mr-0">
                                                            <span className='icon-wrap'>
                                                                <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M16 15.0098L21 10.0098L16 5.00977M6 5.00977L1 10.0098L6 15.0098M13 1.00977L9 19.0098" stroke="#5B5B5B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                            <span className="pl-1 md:pl-2 font-medium">Code</span>
                                                        </button>

                                                        {/* {post.featuredImage?.node?.sourceUrl && (
                                                            <a
                                                                href={post.featuredImage.node.sourceUrl}
                                                                download={post.featuredImage.node.sourceUrl}
                                                                rel="noopener noreferrer"
                                                                target="_blank"
                                                                className="download-button text-xs md:text-base bg-transparent md:hover:bg-theme-blue md:hover:text-white flex items-center justify-center px-0 md:px-4 py-1 md:py-2 rounded-lg whitespace-nowrap border-none left-button"
                                                            >
                                                                <span className='icon-wrap'>
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M19 13.0098V14.2098C19 15.89 19 16.73 18.673 17.3718C18.3854 17.9363 17.9265 18.3952 17.362 18.6828C16.7202 19.0098 15.8802 19.0098 14.2 19.0098H5.8C4.11984 19.0098 3.27976 19.0098 2.63803 18.6828C2.07354 18.3952 1.6146 17.9363 1.32698 17.3718C1 16.73 1 15.89 1 14.2098V13.0098M15 8.00977L10 13.0098M10 13.0098L5 8.00977M10 13.0098V1.00977" stroke="#5B5B5B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg>
                                                                </span>
                                                                <span className="pl-1 md:pl-2 font-medium">Download</span>
                                                            </a>
                                                        )} */}

                                                        <DownloadImageButton htmlContent={post.postdata.content} />


                                                    </div>
                                                </div>
                                            </header>

                                            <div className="email-content-area rounded-b-2xl border border-solid border-theme-border md:p-8 xl:p-16 min-h-screen">
                                                <div className='email-postdata bg-white'>
                                                    <EmailShadowPreview html={post.postdata.content} />
                                                </div>
                                                <CodeView content={post.postdata.content} />

                                                <div>
                                                    <HtmlToImageConverter htmlContent={post.postdata.content} /> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-full xl:w-2/5 xl:pl-16 xl:sticky xl:top-[100px] order-1 xl:order-2 mb-10 xl:mb-0'>
                                        <div className='bg-white px-6 py-8 md:p-8 w-full md:rounded-2xl space-y-4'>

                                            {post.postdata?.brand?.nodes?.[0] && (
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-20 md:w-24 h-20 md:h-24 rounded-full overflow-hidden border border-solid border-theme-border flex items-center justify-center">
                                                        {post.postdata.brand.nodes[0].featuredImage?.node?.sourceUrl ? (
                                                            <Image
                                                                src={post.postdata.brand.nodes[0].featuredImage.node.sourceUrl}
                                                                alt={post.postdata.brand.nodes[0].title || 'Brand logo'}
                                                                width={96}
                                                                height={96}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500 text-sm">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h1>
                                                        <Link className="text-2xl font-bold block" href={`/brands/${post.postdata.brand.nodes[0].slug}`}>{post.postdata.brand.nodes[0].title}</Link>
                                                    </h1>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-base font-intersemi font-semibold pb-1">Subject lines:</h3>
                                                <p className="text-base md:text-lg">{post.title}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-base font-intersemi font-semibold pb-1">Features:</h3>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {post.emailTypes.nodes.map((tag, index) => (
                                                        <span key={index} className="text-base font-medium block leading-4 bg-theme-light-gray-2 text-theme-dark px-4 md:px-4 py-2 md:py-2 rounded-3xl">
                                                            {tag.name}
                                                        </span>
                                                    ))}

                                                    {post.industries.nodes.length > 0 && (
                                                        post.industries.nodes.map((industry, index) => (
                                                            <span key={index} className="text-base font-medium block leading-4 bg-theme-light-gray-2 text-theme-dark px-4 md:px-4 py-2 md:py-2 rounded-3xl">
                                                                {industry.name}
                                                            </span>
                                                        ))
                                                    )}
                                                    {post.seasonals.nodes.length > 0 && (
                                                        post.seasonals.nodes.map((seasonal, index) => (
                                                            <span key={index} className="text-base font-medium block leading-4 bg-theme-light-gray-2 text-theme-dark px-4 md:px-4 py-2 md:py-2 rounded-3xl">
                                                                {seasonal.name}
                                                            </span>
                                                        ))
                                                    )}

                                                    {!hasAnyTaxonomy && (
                                                        <span className="text-base font-medium block leading-4 bg-theme-light-gray-2 text-theme-dark px-4 md:px-4 py-2 md:py-2 rounded-3xl">Other</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className='flex items-center gap-3 border-t border-solid border-theme-border mt-6 pt-6 md:pt-8'>
                                                    <p className='text-base md:text-lg capitalize flex items-center gap-3 text-theme-dark'><Image src={DateIcon} alt="Date Icon" /> {formattedDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </CategoryeScript>

                    <div className='py-10 md:pb-24 md:pt-1 related-category-post xl:px-4'>
                        <div className="container">
                            <h2 className="text-center mb-6 md:mb-10">Maybe you'll also like…</h2>
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {post.emailTypes.nodes.map((tag, index) => (
                                        <Link href={`/email-type/${tag.slug}`} key={index} className="text-sm md:text-base block leading-4 bg-white text-theme-dark hover:bg-theme-blue hover:text-white px-4 md:px-4 py-2 md:py-2 rounded-3xl font-medium">
                                            {tag.name}
                                        </Link>
                                    ))}

                                    {post.industries.nodes.length > 0 && (
                                        post.industries.nodes.map((industry, index) => (
                                            <Link href={`/industry/${industry.slug}`} key={index} className="text-sm md:text-base block leading-4 bg-white text-theme-dark hover:bg-theme-blue hover:text-white px-4 md:px-4 py-2 md:py-2 rounded-3xl font-medium">
                                                {industry.name}
                                            </Link>
                                        ))
                                    )}
                                    {post.seasonals.nodes.length > 0 && (
                                        post.seasonals.nodes.map((seasonal, index) => (
                                            <Link href={`/seasonal/${seasonal.slug}`} key={index} className="text-sm md:text-base block leading-4 bg-white text-theme-dark hover:bg-theme-blue hover:text-white px-4 md:px-4 py-2 md:py-2 rounded-3xl font-medium">
                                                {seasonal.name}
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="related-category pt-8 md:pt-12">
                                <RecentPostData />
                            </div>
                            <div className='text-center mt-12'>
                                <Link href="/categories" className="inline-block bg-theme-blue text-white  hover:bg-theme-dark font-semibold px-1 md:px-6 py-3 md:py-4 rounded-lg whitespace-nowrap border-none text-sm md:text-base w-full md:w-auto">Explore All Email Templetes</Link>
                            </div>
                        </div>
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
            </>
        );
    } catch (error) {
        console.error('Error fetching post:', error);
        // Instead of showing an error page, redirect to 404
        notFound();
    }
}
