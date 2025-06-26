// pages/about.tsx

import { fetchAboutData } from './server/about-data-fetcher';
import VideoScottCohen from './video-scott-cohen';

export default async function AboutPage() {
    const aboutpages = await fetchAboutData();

    return (
        <main>
            <VideoScottCohen aboutpages={aboutpages} />
        </main>
    );
}