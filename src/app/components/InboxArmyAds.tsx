import Image from "next/image";
import Link from "next/link";
import { getBrandData } from '../lib/queries';

import DefaultLogo from '../images/inboxarmy-ads-logo.svg'

interface AdBox {
    cta?: {
        url?: string;
        target?: string;
        title?: string;
    };
    icon?: {
        node?: {
            sourceUrl?: string;
        };
    };
    title?: string;
}

export default async function InboxArmyAdsCard() {
    const { adBoxes } = await getBrandData();

    if (!adBoxes || adBoxes.length === 0) {
        return null; // or a fallback component
    }

    return (
        <>
            {adBoxes.map((adBox: AdBox, index: number) => (
                <Link
                    key={index}
                    href={adBox.cta?.url || "#"}
                    target={adBox.cta?.target || "_self"}
                    className="inboxarmy-ads relative w-full bg-theme-dark text-white text-center shadow-custom rounded-xl border border-solid border-theme-border flex items-center justify-start"
                >
                    <div className="ads-logo relative pb-16 md:pb-20 2xl:pb-16 w-full">
                        <Image
                            className="block m-auto"
                            src={adBox.icon?.node?.sourceUrl || DefaultLogo}
                            width={280}
                            height={480}
                            alt="Brand Logo"
                        />
                        <div className="px-4 2xl:px-6 mt-12 md:mt-8 2xl:mt-16">
                            <p className="h3 text-white 2xl:mb-2">{adBox.title}</p>
                        </div>
                    </div>

                    <div className="absolute left-4 right-4 bottom-6 md:bottom-4 2xl:left-8 2xl:right-8 2xl:bottom-8">
                        <span className="block bg-theme-blue text-white hover:bg-white hover:text-theme-dark font-semibold px-1 md:px-5 py-3 md:py-4 rounded-lg whitespace-nowrap border-none uppercase text-sm md:text-base">
                            {adBox.cta?.title || 'Explore More'}
                        </span>
                    </div>
                </Link>
            ))}
        </>
    );
}