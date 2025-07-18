import { gql } from '@apollo/client';
import { client } from './apollo-client';

// Type definitions for better type safety
interface BrandCategory {
  name: string;
  slug: string;
  count: number;
}

interface BrandImage {
  sourceUrl?: string;
  altText?: string;
}

interface Brand {
  featuredImage?: {
    node?: BrandImage;
  };
  slug: string;
  title: string;
  assignedPostCount: number;
  brandCategories?: {
    nodes: BrandCategory[];
  };
}

interface ApolloResponse<T> {
  data?: T;
}

interface BrandsResponse {
  brands?: {
    nodes: Brand[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

interface BrandCategoriesResponse {
  brandCategories?: {
    nodes: BrandCategory[];
  };
}

export const SEARCH_POSTS = gql`  
  query SearchQuery($search: String!) {
    posts(
      where: { 
        search: $search
        orderby: { field: DATE, order: DESC }
      },
      first: 100
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
      first: 100
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

// Paginated search query for infinite scroll (24 posts per page)
export const SEARCH_POSTS_PAGINATED = gql`  
  query SearchQueryPaginated($search: String!, $after: String) {
    posts(
      where: { 
        search: $search
        orderby: { field: DATE, order: DESC }
      },
      first: 24,
      after: $after
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

const GET_MENUDATA_QUERY = gql`
  query menudata {
    emailTypes(first: 30, where: {parent: 0}) {
      nodes {
        name
        slug
        count
      }
    }
    seasonals(first: 30, where: {parent: 0}) {
      nodes {
        name
        slug
        count
      }
    }
    industries(first: 30, where: {parent: 0}) {
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
query GetBrands {
  brandCategories(first: 600)  {
    nodes {
      name
      slug
      count
    }
  }
}
`;

export const GET_BRANDS_QUERY = gql`
  query GetBrands($after: String) {
    brands(first: 600, after: $after, where: { orderby: { field: TITLE, order: ASC } }) {
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
        assignedPostCount
        brandCategories(first: 600) {
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
    const { data }: ApolloResponse<BrandCategoriesResponse> = await client.query({ query: GET_BRAND_CATEGORIES_QUERY });
    const categories = data?.brandCategories?.nodes ?? [];

    console.log('Fetched brand categories:', categories.map((cat: BrandCategory) => ({ name: cat.name, slug: cat.slug })));

    return {
      brandCategories: categories,
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
    const { data }: ApolloResponse<BrandsResponse> = await client.query({
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

// Search brands with posts query
const SEARCH_BRANDS_QUERY = gql`
  query SearchBrands($search: String!) {
    brands(
      where: { 
        search: $search
      },
      first: 100
    ) {
      nodes {
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        slug
        title
        assignedPostCount
        brandCategories(first: 600) {
          nodes {
            name
            slug
            count
          }
        }
      }
    }
  }
`;



export async function searchBrandsWithPosts(search: string) {
  try {
    const { data } = await client.query({
      query: SEARCH_BRANDS_QUERY,
      variables: { search }
    });
    return {
      brands: data?.brands?.nodes ?? [],
    };
  } catch (error) {
    console.error('Error searching brands:', error);
    return {
      brands: [],
    };
  }
}

export async function filterBrandsByCategory(categorySlug: string) {
  try {
    let allBrands: Brand[] = [];
    let hasNextPage = true;
    let endCursor: string | null = null;

    // Fetch all brands using pagination
    while (hasNextPage) {
      const { data }: ApolloResponse<BrandsResponse> = await client.query({
        query: gql`
          query GetAllBrandsForCategory($after: String) {
            brands(first: 600, after: $after) {
              nodes {
                featuredImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
                slug
                title
                assignedPostCount
                brandCategories(first: 600) {
                  nodes {
                    name
                    slug
                    count
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
        variables: { after: endCursor }
      });

      const brands = data?.brands?.nodes ?? [];
      allBrands = [...allBrands, ...brands];

      hasNextPage = data?.brands?.pageInfo?.hasNextPage ?? false;
      endCursor = data?.brands?.pageInfo?.endCursor ?? null;

      console.log(`Fetched batch of ${brands.length} brands. Total so far: ${allBrands.length}`);
    }

    // Debug: Log some brand category data
    console.log('Sample brand categories:');
    allBrands.slice(0, 3).forEach((brand: Brand, index: number) => {
      console.log(`Brand ${index + 1} (${brand.title}):`, brand.brandCategories?.nodes?.map((c: BrandCategory) => ({ name: c.name, slug: c.slug })));
    });

    // Filter brands on the server side with case-insensitive comparison
    const filteredBrands = allBrands.filter((brand: Brand) =>
      brand.brandCategories?.nodes?.some((category: BrandCategory) =>
        category.slug.toLowerCase() === categorySlug.toLowerCase()
      )
    );

    console.log(`Filtering brands for category "${categorySlug}":`);
    console.log(`Total brands fetched: ${allBrands.length}`);
    console.log(`Filtered brands: ${filteredBrands.length}`);
    console.log(`Filtered brand names:`, filteredBrands.map((b: Brand) => b.title));

    return {
      brands: filteredBrands,
    };
  } catch (error) {
    console.error('Error filtering brands by category:', error);
    return {
      brands: [],
    };
  }
}