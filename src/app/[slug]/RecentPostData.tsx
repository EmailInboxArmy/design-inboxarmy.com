import { gql } from '@apollo/client';
import EmailCard from 'app/components/EmailCard';
import { client } from 'app/lib/apollo-client';


export const RECENT_POST_QUERY = gql`
  query RecentPost {
    posts(first: 5) {
      nodes {
        title
        slug
        uri
        featuredImage {
          node {
            sourceUrl
            srcSet(size: MEDIUM)
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
      }
    }
  }
`;

interface Template {
  title: string;
  slug: string;
  uri: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
      srcSet: string;
    };
  };
  emailTypes: {
    nodes: { name: string; slug: string }[];
  };
  industries: {
    nodes: { name: string; slug: string }[];
  };
  seasonals: {
    nodes: { name: string; slug: string }[];
  };
}

export default async function RecentPostData() {
  const { data } = await client.query({
    query: RECENT_POST_QUERY,
  });

  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 gap-x-2 md:gap-5 2xl:gap-8'>
        {data.posts.nodes.map((template: Template, index: number) => (

          <EmailCard
            key={index}
            title={template.title}
            image={template.featuredImage?.node?.sourceUrl || ''}
            template={template}
            slug={template.slug}
          />

        ))}
      </div>
    </>
  )
};
