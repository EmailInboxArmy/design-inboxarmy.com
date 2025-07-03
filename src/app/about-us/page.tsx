import Testimonials from 'app/components/Testimonials';
import './about.css';
import Awarded from './Awarded';
import Counter from './Counter';
import { fetchEmailServicesData } from './about-queries';
import Gallery from './Gallery';
import VideoScottCohen from './VideoSection';
import MarketingAgency from '../components/MarketingAgency';
import Brands from './brands';
import Industries from './Industries';
import HeroTitle from './HeroTitle';
import { getCounterData } from './server/counter-data';
import EmailService from './EmailService';
import { getTestimonialsData } from './server/testimonials-data';
import { Metadata } from 'next';
import { client } from 'app/lib/apollo-client';
import { ABOUT_US_QUERY } from './about-queries';

// Force dynamic rendering to prevent build-time GraphQL calls
export const dynamic = 'force-dynamic';


export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data } = await client.query({
            query: ABOUT_US_QUERY,
            fetchPolicy: 'network-only',
           
        });

        const seo = data?.page?.seo;

        return {
            title: seo?.title || 'About Us',
            description: seo?.metaDesc || '',
            openGraph: {
                title: seo?.opengraphTitle || seo?.title || 'About Us',
                description: seo?.opengraphDescription || seo?.metaDesc || '',
                images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
            },
        };
    } catch (error) {
        console.error('Error generating about-us metadata:', error);
        return {
            title: 'About Us',
            description: 'Learn more about our company and services',
        };
    }
}

export const revalidate = 10;   

export default async function AboutUs() {
    try {
        const { counterData } = await getCounterData();
        const emailServices = await fetchEmailServicesData();
        const testimonials = await getTestimonialsData();

        return (
            <>
                <span className='block absolute top-0 left-0 w-full h-[112%] md:h-[2462px] bg-gradient-to-b from-[#E9EFE9]'></span>

                <HeroTitle />

                <VideoScottCohen />

                <Gallery />

                <Counter counterData={counterData} />

                <Awarded />

                <EmailService emailServices={emailServices} />

                <Brands />

                <Industries />

                <Testimonials testimonials={testimonials.testimonials} testimonialHeading={testimonials.testimonialHeading} />

                <MarketingAgency marketingAgency={{
                    title: '',
                    subText: '',
                    textArea: '',
                    servicesInformation: [],
                    logo: {
                        node: {
                            sourceUrl: ''
                        }
                    },
                    ratingArea: [],
                    link: {
                        url: '',
                        title: '',
                        target: ''
                    }
                }} />
            </>
        )
    } catch (error) {
        console.error('Error loading about-us data:', error);
        return (
            <div className="container py-20">
                <div className="text-center text-3xl text-red-500 font-bold">
                    Unable to load about-us data at this time
                </div>
            </div>
        );
    }
}