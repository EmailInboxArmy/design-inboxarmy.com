import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import fetch from 'cross-fetch'
import { WORDPRESS_GRAPHQL_ENDPOINT } from '../lib/config';

export const client = new ApolloClient({
    link: new HttpLink({
        uri: WORDPRESS_GRAPHQL_ENDPOINT,
        fetch,
        credentials: 'same-origin'
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
          errorPolicy: 'ignore',
        },
        query: {
          errorPolicy: 'ignore',
        },
      },
});