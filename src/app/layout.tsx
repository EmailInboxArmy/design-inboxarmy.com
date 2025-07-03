import type { Metadata } from 'next';
import './styles/globals.css';

// Components
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import GlobalLoader from './components/GlobalLoader';
import { client } from './lib/apollo-client';
import { gql } from '@apollo/client';
import BodyClassHandler from './components/BodyClassHandler';

const GET_HOME_PAGE_DATA = gql`
query HomePage {
    page(id: "home", idType: URI) {
    id
    slug
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
  }
}
`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await client.query({
      query: GET_HOME_PAGE_DATA,
    });

    const seo = data?.page?.seo;

    return {
      title: seo?.title || 'InboxArmy - Email Marketing Templates',
      description: seo?.metaDesc || 'Discover professional email marketing templates for your business. Browse our collection of industry-specific email templates.',
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: seo?.opengraphTitle || seo?.title || 'InboxArmy - Email Marketing Templates',
        description: seo?.opengraphDescription || seo?.metaDesc || 'Discover professional email marketing templates for your business.',
        images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Return fallback metadata if GraphQL fails
    return {
      title: 'InboxArmy - Email Marketing Templates',
      description: 'Discover professional email marketing templates for your business. Browse our collection of industry-specific email templates.',
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: 'InboxArmy - Email Marketing Templates',
        description: 'Discover professional email marketing templates for your business.',
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body>
        <BodyClassHandler />
        <GlobalLoader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}