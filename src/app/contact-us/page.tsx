import Testimonials from "app/components/Testimonials";
import Image from "next/image";
import { getTestimonialsData } from '../about-us/server/testimonials-data';
import './contact-style.css';
import { gql } from "@apollo/client";
import { client } from "../lib/apollo-client";
import { ContactForm } from "./contactform";
import MapComponent from "../components/mapcomponents";
import { Metadata } from 'next';

interface SocialMedia {
    image?: {
        node?: {
            sourceUrl: string;
        };
    };
    link?: {
        title: string;
        url: string;
        target: string;
    };
}

const GET_CONTACT_PAGE_DATA = gql`
query ContactPage {
    page(id: "contact-us", idType: URI) {
    seo {
      title
      metaDesc
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
        contactUs {
        formTitle
      formContent
            map
            address {
                addressText
                addressIcon {
                    node {
                        sourceUrl
                    }
                }
            }
            email {
                emailIcon {
                    node {
                        sourceUrl
                    }
                }
                emailLink {
                    url
                    title
                    target
                }
            }
            followUsTitle
            socialMedia {
                image {
                    node {
                        sourceUrl
                    }
                }
                link {
                    title
                    url
                    target
                }
            }
        }
    }
}
`;

export async function generateMetadata(): Promise<Metadata> {
    try {
        const { data } = await client.query({
            query: GET_CONTACT_PAGE_DATA,
        });

        const seo = data?.page?.seo;

        return {
            title: seo?.title || 'Contact Us',
            description: seo?.metaDesc || '',
            openGraph: {
                title: seo?.opengraphTitle || seo?.title || 'Contact Us',
                description: seo?.opengraphDescription || seo?.metaDesc || '',
                images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : [],
            },
        };
    } catch (error) {
        console.warn('Failed to fetch metadata for contact page:', error);
        return {
            title: 'Contact Us',
            description: 'Get in touch with us',
        };
    }
}

export const revalidate = 10;   
export default async function ContactUs() {
    const testimonials = await getTestimonialsData();

    let contactData = null;
    try {
        const { data } = await client.query({
            query: GET_CONTACT_PAGE_DATA,
           
        });
        contactData = data?.page?.contactUs;
    } catch (error) {
        console.warn('Failed to fetch contact page data:', error);
        // Provide fallback data or handle gracefully
    }

    return (
        <>
            <div className="mb-16 mt-8 lg:mt-24 lg:mb-10">
                <div className="container">
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-3/5 contact-form pb-12 lg:pb-0">
                            <div className="bg-gradient-to-b from-[#E9EFE9] rounded-3xl py-6 px-4 pb-12 md:pb-0 lg:px-12 lg:pt-12  ">
                                {contactData.formTitle && <h1 className="h2 text-center mb-6" dangerouslySetInnerHTML={{ __html: contactData.formTitle }}></h1>}
                                {contactData.formContent && <div className="text-base md:text-1xl text-center mb-8" dangerouslySetInnerHTML={{ __html: contactData.formContent }}></div>}
                                <ContactForm />
                            </div>
                        </div>
                        {/* Contact Info & Social Links Section */}
                        {contactData && (
                            <div className="w-full lg:w-2/5 lg:pl-20">
                                {/* Map */}
                                <MapComponent mapContent={contactData.map} />
                                <div className="space-y-6 lg:space-y-8 px-4 lg:px:0">
                                    {contactData.address && (
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <span className="w-8 h-8 bg-theme-light-gray-2 rounded-lg flex items-center justify-center">
                                                    <Image
                                                        className="w-4"
                                                        src={contactData.address.addressIcon?.node?.sourceUrl}
                                                        alt="MapIcon"
                                                        width={17}
                                                        height={17}
                                                    />
                                                </span>
                                            </div>
                                            <span className="text-base md:text-lg">
                                                {contactData.address.addressText}
                                            </span>
                                        </div>
                                    )}

                                    {contactData.email && (
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <span className="w-8 h-8 bg-theme-light-gray-2 rounded-lg flex items-center justify-center">
                                                    <Image
                                                        className="w-4"
                                                        src={contactData.email.emailIcon?.node?.sourceUrl}
                                                        alt="EmailIcon"
                                                        width={16}
                                                        height={16}
                                                    />
                                                </span>
                                            </div>
                                            <span className="pt-0.5">
                                                <a
                                                    className="text-base md:text-lg hover:underline"
                                                    href={contactData.email.emailLink?.url}
                                                    target={contactData.email.emailLink?.target || "_self"}
                                                >
                                                    {contactData.email.emailLink?.title}
                                                </a>
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {contactData.socialMedia && contactData.socialMedia.length > 0 && (
                                    <>
                                        <hr className="my-6 lg:my-8 border-theme-border" />
                                        <div>
                                            <h3 className="text-theme-dark font-intersemi font-semibold mb-6 text-lg w-full text-center lg:text-left uppercase">
                                                {contactData.followUsTitle}
                                            </h3>
                                            <div className="flex flex-wrap items-center lg:items-start justify-center lg:justify-start lg:grid grid-cols-2 gap-x-4 lg:gap-x-8 gap-y-4 text-base w-full max-[275px]">
                                                {contactData.socialMedia.map((social: SocialMedia, index: number) => (
                                                    <a
                                                        key={index}
                                                        href={social.link?.url || "#"}
                                                        className="flex items-center gap-2 hover:underline"
                                                        target={social.link?.target || "_blank"}
                                                        rel="noopener noreferrer"
                                                    >
                                                        <span className="w-6">
                                                            <Image
                                                                className="w-6"
                                                                src={social.image?.node?.sourceUrl || ""}
                                                                alt={social.link?.title || "Social Media Icon"}
                                                                width={25}
                                                                height={25}
                                                            />
                                                        </span>
                                                        {social.link?.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Testimonials testimonials={testimonials.testimonials} testimonialHeading={testimonials.testimonialHeading} />
        </>
    );
}
