// components/EmailCard.tsx
import Image from "next/image";
import Link from "next/link";

interface EmailCardProps {
    title: string;
    image: string;
    template: {
        emailTypes: {
            nodes: {
                name: string;
            }[];
        };
        industries: {
            nodes: {
                name: string;
            }[];
        };
        seasonals: {
            nodes: {
                name: string;
            }[];
        };
    };
    slug: string;
}

export default function EmailCard({
    title,
    image,
    template,
    slug
}: EmailCardProps) {
    return (
        <Link href={`/${slug}`} className="email-link w-full bg-white shadow-custom rounded-md md:rounded-xl border border-solid border-theme-border overflow-hidden">
            <div className="email-image relative w-full overflow-hidden">
                {image && (
                    <Image className="absolute left-0 right-0 w-full" src={image} width={280} height={480} alt={title} />
                )}
            </div>
            <div className="p-2 md:p-4">
                <p className="text-theme-dark text-sm md:text-base mb-2">{title}</p>
                <div className="catagery-data flex flex-wrap gap-1">
                    {template.emailTypes?.nodes?.map((tag, index) => (
                        <span key={index} className="text-xxs md:text-sm block leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal">
                            {tag.name}
                        </span>
                    ))}

                    {template.industries?.nodes?.map((tag, index) => (
                        <span key={index} className="text-xxs md:text-sm block leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal">
                            {tag.name}
                        </span>
                    ))}

                    {template.seasonals?.nodes?.map((tag, index) => (
                        <span key={index} className="text-xxs md:text-sm block leading-4 bg-theme-light-gray text-theme-dark px-2 md:px-4 py-1 md:py-2 rounded-md font-normal">
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
