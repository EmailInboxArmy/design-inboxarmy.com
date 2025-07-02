import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import fetch from 'cross-fetch'
import { WORDPRESS_GRAPHQL_ENDPOINT } from '../lib/config';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

// HTTP link with timeout and retry logic
const httpLink = new HttpLink({
    uri: WORDPRESS_GRAPHQL_ENDPOINT,
    fetch: (uri, options) => {
        // Add timeout to prevent hanging requests during build
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        return fetch(uri, {
            ...options,
            signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));
    },
});

export const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Page: {
                keyFields: ['id', 'slug'],
                fields: {
                    // Merge function for Page type
                    __typename: {
                        read() {
                            return 'Page';
                        },
                    },
                },
            },
            Post: {
                keyFields: ['id', 'slug'],
            },
            MediaItem: {
                keyFields: ['id', 'sourceUrl'],
            },
            PostTypeSEO: {
                keyFields: false, // No unique identifier needed
            },
            AboutUs: {
                keyFields: false, // No unique identifier needed
            },
            AboutUsLogoImages: {
                keyFields: false, // No unique identifier needed
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
    },
});