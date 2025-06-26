import { gql } from '@apollo/client';
import { client } from './apollo-client';

export const SEARCH_POSTS = gql`  
  query SearchQuery($search: String!) {
    posts(
      where: { 
        search: $search,
        orderby: { field: DATE, order: DESC }
      },
      first: 500
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
      first: 50
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
      }
    }
    seasonals(first: 1000000) {
      nodes {
        name
        slug
      }
    }
    industries(first: 1000000) {
      nodes {
        name
        slug
      }
    }
  }
`;

export async function postdata() {
  const { data } = await client.query({ query: GET_MENUDATA_QUERY });
  return {
    emailTypes: data?.emailTypes?.nodes ?? [],
    seasonals: data?.seasonals?.nodes ?? [],
    industries: data?.industries?.nodes ?? [],
  };
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
  const { data } = await client.query({ query: GET_BRAND_QUERY });
  return {
    adBoxes: data?.themeoptions?.globaldata?.adBoxes ?? [],
  };
}

export const GET_BRANDS_QUERY = gql`
  query BrandsData {
    brands(first: 10000)  {
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
          brandCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
  }
`;

export async function getBrandsData() {
  const { data } = await client.query({ query: GET_BRANDS_QUERY });
  return {
    brands: data?.brands?.nodes ?? [],
  };
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
  const { data } = await client.query({ query: GET_BRAND_PAGE_QUERY });
  return {
    brandPage: data?.pages?.nodes?.[0]?.brandPage ?? [],
  };
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

export async function getBrandCategoriesData() {
  const { data } = await client.query({ query: GET_BRAND_CATEGORIES_QUERY });
  return {
    brandCategories: data?.brandCategories?.nodes ?? [],
  };
}