import Image from 'next/image';
// import Link from 'next/link';
import InboxArmyLogo from '../images/inboxarmy-whitelogo.svg';
import EmailBanner from '../images/email-banner.webp';
import Clutch from '../images/clutch.svg';
import Google from '../images/google.svg';
import RattingStar from '../images/ratting-star.svg';
import { gql } from '@apollo/client';
import { client } from 'app/lib/apollo-client';

interface Post {
    title: string;
    subText: string;
    textArea: string;
    servicesInformation: {
        informationText: string;
    }[];
    logo: {
        node: {
            sourceUrl: string;
        };
    };
    ratingArea: {
        ratingNumber: string;
        ratingCompanyLogo: {
            node: {
                sourceUrl: string;
                altText: string;
            };
        };
        ratingStar: {
            node: {
                sourceUrl: string;
            };
        };
    }[];
    link: {
        url: string;
        title: string;
        target: string;
    };
}

interface MarketingAgencyProps {
    marketingAgency?: Post;
}

const GET_MARKETING_AGENCY_DATA = gql`
    query GetMarketingAgencyData {
        themeoptions {
            globaldata {
                logo {
                    node {
                        sourceUrl
                    }
                }
                ratingArea {
                    ratingNumber
                    ratingCompanyLogo {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                    ratingStar {
                        node {
                            sourceUrl
                        }
                    }
                }
                servicesInformation {
                    informationText
                }
                subText
                title
                textArea
                link {
                    url
                    title
                    target
                }
            }
        }
    }
`;

export default async function MarketingAgency({ marketingAgency }: MarketingAgencyProps) {
    try {
        const { data } = await client.query({
            query: GET_MARKETING_AGENCY_DATA,
            fetchPolicy: 'network-only'
        });

        const agencyData = data?.themeoptions?.globaldata || marketingAgency;

        if (!agencyData) {
            console.log('No agency data found');
            return <div>Loading...</div>;
        }

        return (
            <>
                <section className="email-service-section text-white bg-cover bg-center py-10 md:py-24" style={{ backgroundImage: `url(${EmailBanner.src})` }}>
                    <div className="container">
                        <div className='w-full max-w-7xl mx-auto xl:px-10'>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className='w-full md:w-2/3 lg:w-3/4'>
                                    <div className="mb-8 w-40 md:w-auto">
                                        <Image src={agencyData.logo?.node?.sourceUrl || InboxArmyLogo} alt='Logo' width={284} height={56} />
                                    </div>
                                    <div className="w-full">
                                        <h2 className="mb-6">{agencyData.title}</h2>
                                        <p className="mb-6 text-white text-lg md:text-1xl">{agencyData.subText}</p>
                                        <div className="content-text" dangerouslySetInnerHTML={{ __html: agencyData.textArea }}></div>

                                        {agencyData.link?.url && (
                                            <a href={agencyData.link?.url} target={agencyData.link?.target || '_blank'} className='hidden md:inline-block bg-theme-blue text-white hover:bg-white hover:text-theme-dark font-intersemi font-semibold px-1 md:px-5 py-3 md:py-4 mt-8 rounded-lg whitespace-nowrap border-none uppercase text-sm md:text-base'>
                                                {agencyData.link?.title}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full md:w-1/3 lg:w-1/4">
                                    <div className="space-y-2 md:space-y-4">
                                        <div className='grid grid-cols-2 gap-x-2 md:space-y-4 md:block'>
                                            {agencyData.ratingArea?.map((rating: {
                                                ratingNumber: string;
                                                ratingCompanyLogo: {
                                                    node: {
                                                        sourceUrl: string;
                                                        altText: string;
                                                    };
                                                };
                                                ratingStar: {
                                                    node: {
                                                        sourceUrl: string;
                                                    };
                                                };
                                            }, index: number) => (
                                                <div key={index} className="rounded-2xl px-4 md:px-8 py-4 flex items-center justify-between bg-white bg-opacity-10">
                                                    <div className="text-white text-2xl font-bold max-w-10 md:max-w-[102px]">
                                                        <Image
                                                            className='w-full'
                                                            src={rating.ratingCompanyLogo?.node?.sourceUrl || (index === 0 ? Clutch : Google)}
                                                            width={100}
                                                            height={50}
                                                            alt={rating.ratingCompanyLogo?.node?.altText || 'Logo'}
                                                        />
                                                    </div>
                                                    <div className="flex items-center flex-wrap flex-col pl-4 md:pl-6">
                                                        <span className="text-base md:text-4xl lg:text-32xl text-white font-intersemi font-semibold w-full block pb-1">
                                                            {rating.ratingNumber}
                                                        </span>
                                                        <Image
                                                            src={rating.ratingStar?.node?.sourceUrl || RattingStar}
                                                            width={100}
                                                            height={50}
                                                            alt='Rating Star'
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className='agency-box flex flex-wrap md:space-y-4 md:block'>
                                            {agencyData.servicesInformation?.slice().map((service: { informationText: string }, index: number) => (
                                                <div key={index} className="info-text rounded-2xl px-4 md:px-8 py-4 flex items-center bg-white bg-opacity-10 min-h-80 md:min-h-[102px]">
                                                    <div className='text-base md:text-1xl leading-6 md:leading-8 block 2xl:pr-10' dangerouslySetInnerHTML={{ __html: service.informationText }}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {agencyData.link?.url && (
                                    <a href={agencyData.link?.url} target={agencyData.link?.target || '_blank'} className='block md:hidden bg-theme-blue text-white hover:bg-white hover:text-theme-dark font-semibold px-1 md:px-5 py-3 md:py-4 rounded-lg whitespace-nowrap border-none uppercase text-sm md:text-base text-center'>
                                        {agencyData.link?.title}
                                    </a>
                                )}

                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    } catch (error) {
        console.error('Error fetching marketing agency data:', error);
        return <div>Error fetching marketing agency data.</div>;
    }
}
