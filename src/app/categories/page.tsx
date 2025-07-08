import { client } from '../lib/apollo-client';
import { gql } from '@apollo/client'
import MarketingAgency from "app/components/MarketingAgency";
import InfiniteScrollTemplates from '../components/InfiniteScrollTemplates';
import { getCategoriesData } from '../lib/categories';
import { getBrandData } from '../lib/queries';

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
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
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
}

const EMAIL_TEMPLATES_QUERY = gql`
    query EmailTemplate($after: String) {
    posts(first: 75, after: $after) {
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

export const revalidate = 10;
export default async function Categories() {


  try {
    const { data } = await client.query<EmailTemplateData>({
      query: EMAIL_TEMPLATES_QUERY,
      fetchPolicy: 'no-cache',
    });

    const categoriesData = await getCategoriesData();
    const { adBoxes } = await getBrandData();

    return (
      <>
        <div className="container">
          <div className="text-center py-10 md:py-20 max-w-6xl w-full m-auto">
            <h1 className="leading-tight tracking-tight pb-6 pt-4 md:py-5 block">{categoriesData?.topHeading}</h1>
            <p className="p2 w-full m-auto pt-2 text-theme-text-2">{categoriesData?.topText}</p>
          </div>
        </div>

        <div className="pt-4 pb-6 px-4 xl:px-12 md:pt-6">
          <InfiniteScrollTemplates
            initialTemplates={data.posts.nodes}
            hasNextPage={data.posts.pageInfo.hasNextPage}
            endCursor={data.posts.pageInfo.endCursor}
            adBoxes={adBoxes}
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
    console.error('Error fetching home page data:', error);
    return <div>Error loading content.</div>;
  }
}
