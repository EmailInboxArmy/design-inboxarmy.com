import { gql } from '@apollo/client';
import { client } from 'app/lib/apollo-client';

export const GET_TESTIMONIALS = gql`
  query Testimonials {
  themeoptions {
    globaldata {
      testimonialData {
        desktopImage {
          node {
            sourceUrl
          }
        }
        mobileImage {
          node {
            sourceUrl
          }
        }
        tabletImage {
          node {
            sourceUrl
          }
        }
      }
      testimonialHeading
    }
  }
}
`;

export async function getTestimonialsData() {
    try {
        const { data } = await client.query({
            query: GET_TESTIMONIALS,
        });
        const testimonials = data?.themeoptions?.globaldata?.testimonialData ?? [];
        const testimonialHeading = data?.themeoptions?.globaldata?.testimonialHeading ?? '';

        return { testimonials, testimonialHeading };
    } catch (error) {
        console.error('Error fetching testimonials data:', error);
        return { testimonials: [], testimonialHeading: '' };
    }
}
