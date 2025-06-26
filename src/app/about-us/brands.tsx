import Image from 'next/image'
import { client } from 'app/lib/apollo-client';
import { BRANDS_QUERY } from './about-queries';


interface BrandsImage {
    image: {
        node: {
            sourceUrl: string;
            altText: string;
        }
    }
}

async function getBrandsData() {
    const { data } = await client.query({ query: BRANDS_QUERY });
    const brandsNode = data?.page?.aboutUs;
    return brandsNode ?? {};
}


export default async function Brands() {
    const brandsData = await getBrandsData();
    const { brandsHeading, brandsContent, brandsImages } = brandsData;

    return (
        <>
            <section className='relative z-10 my-10 md:my-16 lg:my-20'>
                <div className='container small-container'>
                    <div className='subtitle2 text-center max-w-4xl xl:px-10 w-full mx-auto space-y-6 mb-8 md:mb-12'>
                        <h2>{brandsHeading}</h2>
                        <p>{brandsContent}</p>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 items-center gap-6 md:gap-12">
                        {brandsImages?.map((item: BrandsImage, index: number) => (
                            <div key={index} className="brand-logo">
                                <Image className='block m-auto' src={item.image.node.sourceUrl} width={150} height={50} alt={item.image.node.altText} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}