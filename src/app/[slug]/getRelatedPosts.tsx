// queries/getRelatedPosts.js
import { gql } from '@apollo/client';

export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts(
    $excludePostId: ID!
    $emailTypeIds: [ID]
    $industryIds: [ID]
    $seasonalIds: [ID]
  ) {
    posts(
      first: 5
      where: {
        notIn: [$excludePostId]
        taxQuery: {
          relation: OR
          taxArray: [
            {
              taxonomy: EMAILTYPES
              field: ID
              terms: $emailTypeIds
            }
            {
              taxonomy: INDUSTRIES
              field: ID
              terms: $industryIds
            }
            {
              taxonomy: SEASONALS
              field: ID
              terms: $seasonalIds
            }
          ]
        }
      }
    ) {
      nodes {
        id
        title
        slug
      }
    }
  }
`;
