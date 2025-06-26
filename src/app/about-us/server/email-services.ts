import { gql } from '@apollo/client';
import { client } from 'app/lib/apollo-client';

interface LogoImage {
  image: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
}

interface AboutUs {
  emailHeading: string;
  emailContent: string;
  logoImages: LogoImage[];
}

interface PageNode {
  aboutUs: AboutUs;
}

interface EmailServicesData {
  pages: {
    nodes: PageNode[];
  };
}

export const EMAILSERVICES_QUERY = gql`
  query EmailServices {
    pages {
      nodes {
        aboutUs {
          emailHeading
          emailContent
          logoImages {
            image {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

export async function getEmailServicesData() {
  try {
    const { data } = await client.query<EmailServicesData>({ query: EMAILSERVICES_QUERY });
    const emailServicesNode = data?.pages?.nodes?.find((node) => node?.aboutUs);

    return {
      emailServices: emailServicesNode?.aboutUs ?? {},
    };
  } catch (error) {
    console.error('Error fetching email services data:', error);
    return {
      emailServices: {},
    };
  }
} 