import { gql } from '@apollo/client';
import { client } from './apollo-client';

export const SEARCH_POSTS = gql`  
  query SearchQuery($search: String!) {
    posts(
      where: { 
        search: $search,
        orderby: { field: DATE, order: DESC }
      },
      first: 1000
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Alternative search query that might work better
export const SEARCH_POSTS_ALT = gql`  
  query SearchQueryAlt($search: String!) {
    posts(
      where: { 
        search: $search
      },
      first: 1000
    ) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
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

// Simple search query that might work better
export const SIMPLE_SEARCH_POSTS = gql`  
  query SimpleSearchQuery($search: String!) {
    posts(
      where: { 
        search: $search
      }
    ) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        emailTypes {
          nodes {
            name
          }
        }
        industries {
          nodes {
            name
          }
        }
        seasonals {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const GET_MENUDATA_QUERY = gql`
  query menudata {
    emailTypes(first: 1000000) {
      nodes {
        name
        slug
        count
      }
    }
    seasonals(first: 1000000) {
      nodes {
        name
        slug
        count
      }
    }
    industries(first: 1000000) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export async function postdata() {
  try {
    const { data } = await client.query({ query: GET_MENUDATA_QUERY });
    return {
      emailTypes: data?.emailTypes?.nodes ?? [],
      seasonals: data?.seasonals?.nodes ?? [],
      industries: data?.industries?.nodes ?? [],
    };
  } catch (error) {
    console.error('Error fetching post data:', error);
    return {
      emailTypes: [],
      seasonals: [],
      industries: [],
    };
  }
}

export const GET_BRAND_QUERY = gql`
  query GetBrand {
    themeoptions {
      globaldata {
        adBoxes {
          title
          icon {
            node {
              sourceUrl
            }
          }
          cta {
            url
            title
            target
          }
        }
      }
    }
  }
`;

export async function getBrandData() {
  try {
    const { data } = await client.query({ query: GET_BRAND_QUERY });
    return {
      adBoxes: data?.themeoptions?.globaldata?.adBoxes ?? [],
    };
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return {
      adBoxes: [],
    };
  }
}


export const GET_BRAND_PAGE_QUERY = gql`
query BrandPage {
  pages {
    nodes {
      brandPage {
        brandTitle
        brandText
      }
    }
  }
}
`;
export async function getBrandPageData() {
  try {
    const { data } = await client.query({ query: GET_BRAND_PAGE_QUERY });
    return {
      brandPage: data?.pages?.nodes?.[0]?.brandPage ?? [],
    };
  } catch (error) {
    console.error('Error fetching brand page data:', error);
    return {
      brandPage: [],
    };
  }
}


export const GET_BRAND_CATEGORIES_QUERY = gql`
query BrandsData {
  brandCategories {
    nodes {
      name
      slug
    }
  }
}
`;

export const GET_BRANDS_QUERY = gql`
  query GetBrands($after: String) {
    brands(first: 30, after: $after) {
      nodes {
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        slug
        title
        brandCategories(first: 10) {
          nodes {
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

export async function getBrandCategoriesData() {
  try {
    const { data } = await client.query({ query: GET_BRAND_CATEGORIES_QUERY });
    return {
      brandCategories: data?.brandCategories?.nodes ?? [],
    };
  } catch (error) {
    console.error('Error fetching brand categories data:', error);
    return {
      brandCategories: [],
    };
  }
}

export async function getBrandsData(after: string | null = null) {
  try {
    const { data } = await client.query({
      query: GET_BRANDS_QUERY,
      variables: { after }
    });
    return {
      brands: data?.brands?.nodes ?? [],
      hasNextPage: data?.brands?.pageInfo?.hasNextPage ?? false,
      endCursor: data?.brands?.pageInfo?.endCursor ?? '',
    };
  } catch (error) {
    console.error('Error fetching brands data:', error);
    return {
      brands: [],
      hasNextPage: false,
      endCursor: '',
    };
  }
}