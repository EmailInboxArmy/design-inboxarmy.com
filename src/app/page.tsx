import { client } from './lib/apollo-client';
import { gql } from '@apollo/client';
import InfiniteScrollTemplates from './components/InfiniteScrollTemplates';
import HeroSection from "./components/HeroBanner";
import { getBrandData } from './lib/queries';
import { Metadata } from 'next';
import Link from 'next/link';

interface EmailTemplateData {
  posts: {
    nodes: {
      title: string;
      slug: string;
      uri: string;
      featuredImage: {
        node: {
          sourceUrl: string;
        };
      };
      emailTypes?: {
        nodes: {
          id: string;
          name: string;
          slug: string;
        }[];
      };
      industries?: {
        nodes: {
          id: string;
          name: string;
          slug: string;
        }[];
      };
      seasonals?: {
        nodes: {
          id: string;
          name: string;
          slug: string;
        }[];
      };
      types?: {
        nodes: {
          id: string;
          name: string;
          slug: string;
        }[];
      };
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

const GET_HOME_PAGE_DATA = gql`
query HomePage {
    page(id: "home", idType: URI) {
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

const EMAIL_TEMPLATES_QUERY = gql`
  query EmailTemplate($after: String) {
    posts(first: 11, after: $after) {
     
      nodes {
        title
        slug
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }      
        emailTypes(first: 1) {
          nodes {
            id
            name
            slug
          }
        }
        industries(first: 1) {
          nodes {
            id
            name
            slug
          }
        }
        seasonals(first: 1) {
          nodes {
            id
            name
            slug
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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await client.query({
      query: GET_HOME_PAGE_DATA,
    });

    const seo = data?.page?.seo;

    return {
      title: seo?.title || 'InboxArmy - Email Marketing Templates',
      description: seo?.metaDesc || 'Discover professional email marketing templates for your business. Browse our collection of industry-specific email templates.',
      openGraph: {
        title: seo?.opengraphTitle || seo?.title || 'InboxArmy - Email Marketing Templates',
        description: seo?.opengraphDescription || seo?.metaDesc || 'Discover professional email marketing templates for your business.',
        images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Return fallback metadata if GraphQL fails
    return {
      title: 'InboxArmy - Email Marketing Templates',
      description: 'Discover professional email marketing templates for your business. Browse our collection of industry-specific email templates.',
      openGraph: {
        title: 'InboxArmy - Email Marketing Templates',
        description: 'Discover professional email marketing templates for your business.',
      },
    };
  }
}

export default async function Home() {
  try {
    const { data } = await client.query<EmailTemplateData>({
      query: EMAIL_TEMPLATES_QUERY,
    });

    const { adBoxes } = await getBrandData();

    return (
      <>
        <HeroSection />

        <div className="pt-4 pb-6 px-4 xl:px-12 md:pt-5">
          <InfiniteScrollTemplates
            initialTemplates={data.posts.nodes}
            hasNextPage={data.posts.pageInfo.hasNextPage}
            endCursor={data.posts.pageInfo.endCursor}
            adBoxes={adBoxes}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to InboxArmy</h1>
          <p className="text-gray-600 mb-6">We&apos;re experiencing some technical difficulties. Please try again later.</p>
          <div className="space-y-4">
            <Link href="/search" className="block bg-theme-blue text-white px-6 py-3 rounded-lg hover:bg-theme-dark">
              Search Templates
            </Link>
            <Link href="/categories" className="block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }
}