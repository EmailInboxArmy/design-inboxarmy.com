import { GALLERY_QUERY } from './about-queries';
import { client } from 'app/lib/apollo-client';
import Image from 'next/image';

interface GalleryImage {
    image: {
        node: {
            sourceUrl: string;
            altText: string;
        }
    }
}

async function getGalleryData() {
    const { data } = await client.query({ query: GALLERY_QUERY });
    return data?.page?.aboutUs ?? {};
}

export default async function Gallery() {
    const galleryData = await getGalleryData();
    const { galleryHeading, galleryImages } = galleryData;

    return (
        <>
            <section className='relative z-10 my-10 md:my-16 lg:my-20'>
                <div className='container small-container text-center space-y-6 md:space-y-12'>
                    <h2>{galleryHeading}</h2>

                    <div className='gallery-wrapper grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-10'>
                        {galleryImages?.map((item: GalleryImage, index: number) => (
                            <div key={index} className='image-box h-40 sm:h-60 md:h-40 lg:h-48 xl:h-64 2xl:h-80 border-[3px] border-solid border-theme-dark rounded-2xl overflow-hidden'>
                                <Image
                                    className='w-full h-full object-cover'
                                    src={item.image.node.sourceUrl}
                                    alt={item.image.node.altText || 'Gallery Image'}
                                    width={304}
                                    height={320}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}