import Image from 'next/image';
import { client } from 'app/lib/apollo-client';
import { INDUSTRIES_QUERY } from './about-queries';


interface IndustriesImage {
    title: string;
    url: string;
    target: string;
    image: {
        node: {
            sourceUrl: string;
            altText: string;
        }
    }
    industriesLink: {
        title: string;
        url: string;
        target: string;
    }
}

async function getIndustriesData() {
    const { data } = await client.query({ query: INDUSTRIES_QUERY });
    const industriesNode = data?.page?.aboutUs;
    return industriesNode ?? {};
}





export default async function Industries() {
    const indData = await getIndustriesData();
    const { industriesTitle, industriesContent, industriesData, industriesLink } = indData;

    return (
        <>
            <section className="relative z-10 py-10 md:py-16 lg:py-24 bg-theme-light-gray">
                <div className="container small-container items-center">

                    <div className="flex flex-col items-center text-center mb-12 industry-title">
                        <h2 className="mb-4" dangerouslySetInnerHTML={{ __html: industriesTitle }} />
                        <p className='text-base md:text-lg' dangerouslySetInnerHTML={{ __html: industriesContent }} />
                    </div>
                    <div className="industry-card-wrapper flex flex-wrap xl:flex-nowrap items-start justify-center  gap-6 justify-items-center pb-10">

                        {industriesData?.map((item: IndustriesImage, index: number) => (
                            <div key={index} className="cardwrap shadow-custom flex flex-col items-center bg-white rounded-full p-6 w-36 h-36 md:w-40 md:h-40 xl:w-36 2xl:w-[154px] xl:h-36 2xl:h-[154px] justify-center">
                                <div className='image-row m-0 w-12 md:w-auto'>
                                    <Image className='block m-auto' src={item.image.node.sourceUrl} height={61} width={55} alt={item.image.node.altText} />
                                </div>
                                <span className="text-base block text-center mt-4" dangerouslySetInnerHTML={{ __html: item.title }} />
                            </div>
                        ))}
                    </div>

                    <div className="md:flex justify-center">
                        {industriesLink?.url && (
                            <a href={industriesLink.url} target={industriesLink.target} className="text-center block bg-theme-blue text-white  hover:bg-theme-dark font-semibold px-1 md:px-5 py-3 md:py-4 rounded-lg whitespace-nowrap border-none uppercase text-sm md:text-base">{industriesLink.title}</a>
                        )}
                    </div>
                </div>

            </section>
        </>
    );
}