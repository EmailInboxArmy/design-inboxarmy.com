// server/about-data-fetcher.tsx

import { aboutdata } from '../about-queries';

export const fetchAboutData = async () => {
    const { aboutpages } = await aboutdata();
    return aboutpages;
};