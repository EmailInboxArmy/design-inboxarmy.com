import { aboutdata } from './about-queries';

export default async function HeroTitle() {
    const { aboutpages } = await aboutdata();

    // If no content exists, don't render anything
    if (!aboutpages?.heroHeading && !aboutpages?.heroContent) {
        return null;
    }

    return (
        <>
            <div className="my-10 md:my-24 relative z-10">
                <div className="container small-container text-center">
                    {aboutpages?.heroHeading && (
                        <h1 className="tracking-tight pb-6 md:pt-4 md:py-5 lg:px-20 block">{aboutpages.heroHeading}</h1>
                    )}
                    {aboutpages?.heroContent && (
                        <p className="text-base md:text-1xl pt-2 text-theme-text-2">{aboutpages.heroContent}</p>
                    )}
                </div>
            </div>
        </>
    )
}