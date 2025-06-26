// queries/getPost.js
import { gql } from '@apollo/client';

export const GET_POST_WITH_TAXONOMIES = gql`
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      emailTypes {
        nodes {
          id
          name
          slug
        }
      }
      industries {
        nodes {
          id
          name
          slug
        }
      }
      seasonals {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`;
