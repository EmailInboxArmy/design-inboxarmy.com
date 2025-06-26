import Image from 'next/image';
import { client } from 'app/lib/apollo-client';
import { AWARD_QUERY } from './about-queries';

interface AwardImage {
    image: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
    awardLink: {
        url: string;
        title: string;
        target: string;
    };
}

interface AwardUsData {
    awardImage?: AwardImage[];
    awardHeading?: string;
    awardLink?: {
        url: string;
        title: string;
        target: string;
    };
}

export default async function Awarded() {

    const { data } = await client.query<{ page: { aboutUs: AwardUsData } }>({
        query: AWARD_QUERY,
    });

    const { awardImage = [], awardHeading = '', awardLink = { url: '', title: '', target: '' } } = data?.page?.aboutUs ?? {};

    return (
        <section className='relative z-10 my-10 md:my-16 lg:my-20'>
            <div className='container small-container text-center'>
                <h2 className='mb-11'>{awardHeading}</h2>
                <div className="award-images flex flex-wrap justify-center items-center gap-8">
                    {awardImage?.length > 0 &&
                        awardImage.map((award, index) => (
                            <div key={index} className="award-row">
                                <Image
                                    src={award.image.node.sourceUrl}
                                    alt={award.image.node.altText || 'Award'}
                                    width={200}
                                    height={200}
                                />
                            </div>
                        ))}
                </div>
                <div className="mt-11 md:flex justify-center">
                    {awardLink?.url && (
                        <a href={awardLink.url} target={awardLink.target} rel="noopener noreferrer" className="block bg-theme-blue text-white  hover:bg-theme-dark font-semibold px-1 md:px-6 py-3 md:py-4 rounded-lg whitespace-nowrap border-none text-sm md:text-base">
                            {awardLink.title}
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}