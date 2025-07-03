import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import fetch from 'cross-fetch'
import { WORDPRESS_GRAPHQL_ENDPOINT } from '../lib/config';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
            // Don't log build-time errors as they're expected
            if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );
            }
        });
    if (networkError && (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined')) {
        console.log(`[Network error]: ${networkError}`);
    }
});

// HTTP link with timeout and retry logic
const httpLink = new HttpLink({
    uri: WORDPRESS_GRAPHQL_ENDPOINT,
    fetch: (uri, options) => {
        // Check if we're in build mode (SSG/SSR)
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            // During build time, return a mock response to prevent build failures
            return Promise.resolve(new Response(JSON.stringify({
                data: null,
                errors: [{ message: 'GraphQL endpoint not available during build' }]
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }));
        }

        // Add timeout to prevent hanging requests during build
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 second timeout

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