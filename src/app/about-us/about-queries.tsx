import { gql } from '@apollo/client';
import { client } from 'app/lib/apollo-client';

export const ABOUT_US_QUERY = gql`
query AboutPage {
  page(id: "about-us", idType: URI) {
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
    aboutUs {
      heroHeading
      heroContent
      videoHeading
      videoContent
      videoUrl
      videoImage {
        node {
          sourceUrl
        }
      }
    }
  }
}
`;

export async function aboutdata() {
  const { data } = await client.query({ query: ABOUT_US_QUERY });

  return {
    aboutpages: data?.page?.aboutUs ?? {},
  };
}


export const GALLERY_QUERY = gql`
    query AboutGallery {
      page(id: "about-us", idType: URI) {
        aboutUs {
          galleryHeading
          galleryImages {
            image {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
`;


export const AWARD_QUERY = gql`
  query Award {
    page(id: "about-us", idType: URI) {
      aboutUs {
        awardImage {
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        awardHeading
        awardLink {
          url
          title
          target
        }
      }
    }
  }
`;


export const COUNTER_QUERY = gql`
query Counter {
    pages {
      nodes {
        aboutUs {
          counterNumber {
            content
            number
            numberSuffixAfter
            numberSuffixBefore
          }
        }
      }
    }
  }
`;
// server/email-services-fetcher.tsx


export const EMAILSERVICES_QUERY = gql`
  query EmailServices {
    page(id: "about-us", idType: URI) {
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
`;

export const fetchEmailServicesData = async () => {
  try {
    const { data } = await client.query({
      query: EMAILSERVICES_QUERY,
      fetchPolicy: 'network-only',
    });

    // Extract the first page's aboutUs data
    const aboutUs = data?.page?.aboutUs || {};

    return {
      emailHeading: aboutUs.emailHeading || '',
      emailContent: aboutUs.emailContent || '',
      logoImages: aboutUs.logoImages || [],
    };
  } catch (error) {
    console.error('Error fetching email services data:', error);
    return {
      emailHeading: '',
      emailContent: '',
      logoImages: [],
    };
  }
};

export const BRANDS_QUERY = gql`
    query BrandsData {
        page(id: "about-us", idType: URI) {
            aboutUs {
              brandsHeading
              brandsContent
              brandsImages {
                image {
                    node {
                    sourceUrl
                    altText
                    }
                }
              }
            }
        }
    }
`;



export const INDUSTRIES_QUERY = gql`
  query industries {
   page(id: "about-us", idType: URI) {
        aboutUs {
          industriesTitle
          industriesContent
          industriesData {
            image {
              node {
                altText
                sourceUrl
              }
            }
            title
          }
          industriesLink {
            title
            url
            target
          }
      }
    }
  }
`;





