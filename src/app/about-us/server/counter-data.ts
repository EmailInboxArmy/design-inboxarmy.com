import { client } from 'app/lib/apollo-client';
import { COUNTER_QUERY } from '../about-queries';

interface CounterNumber {
    content: string;
    number: number;
    numberSuffixAfter?: string;
    numberSuffixBefore?: string;
}

interface PageNode {
    aboutUs?: {
        counterNumber?: CounterNumber[];
    };
}

export async function getCounterData() {
    try {
        const { data } = await client.query({ query: COUNTER_QUERY });
        const counterNode = data?.pages?.nodes?.find((node: PageNode) => node?.aboutUs?.counterNumber);

        return {
            counterData: counterNode?.aboutUs?.counterNumber ?? []
        };
    } catch (error) {
        console.error('Error fetching counter data:', error);
        return {
            counterData: []
        };
    }
} 