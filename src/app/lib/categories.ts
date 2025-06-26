import { client } from './apollo-client';
import { gql } from '@apollo/client';

interface CategoryNode {
  categories?: {
    topHeading?: string;
    topText?: string;
  };
}

export async function getCategoriesData() {
  const query = gql`
    query CategoriesSection {
      pages {
        nodes {
          categories {
            topHeading
            topText
          }
        }
      }
    }
  `;

  try {
    const { data } = await client.query({ query });
    const validNode = data?.pages?.nodes?.find(
      (node: CategoryNode) => node?.categories?.topHeading || node?.categories?.topText
    );
    return validNode?.categories ?? null;
  } catch (error) {
    console.error('Error fetching categories data:', error);
    return null;
  }
} 