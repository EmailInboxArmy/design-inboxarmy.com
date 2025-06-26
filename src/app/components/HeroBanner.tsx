import { client } from '../lib/apollo-client'
import { gql } from '@apollo/client'

import HeaderSearch from "./HeaderSearch";



interface HomePageData {
    title: string;
    heading: string;
    content: string;
}

interface PageNode {
    homePage: HomePageData | null;
}

export async function herodata() {
    const query = gql`
    query HeroSection {
        pages {
            nodes {
                homePage {
                    title
                    heading
                    content
                }
            }
        }
    }
    `;

    try {
        const { data } = await client.query({ query });
        // Find the first node with a non-null title
        const heroNode = data?.pages?.nodes.find(
            (node: PageNode) => node?.homePage?.title
        );
        const result = heroNode?.homePage ?? {};
        return result;
    } catch (error) {
        console.error('Error fetching hero data:', error);
    }
}

export default async function HeroSection() {
    const heroData = await herodata();

    return (
        <>
            <div className="px-4">
                <div className="text-center py-10 md:py-20 max-w-4xl w-full m-auto">
                    <span className="block p2 uppercase font-semibold text-theme-text-2">{heroData?.title}</span>
                    <h1 className="leading-tight tracking-tight pb-6 pt-4 md:py-5 block">{heroData?.heading}</h1>
                    <p className="p2 w-full max-w-xl m-auto pt-2 text-theme-text-2">
                        {heroData?.content}
                    </p>
                    <div className="w-full max-w-3xl m-auto md:px-6 mt-8 banner-search">
                        <HeaderSearch />
                    </div>
                </div>
            </div>
        </>
    );
}