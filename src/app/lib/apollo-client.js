import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import fetch from 'cross-fetch'

export const client = new ApolloClient({
    link: new HttpLink({
        uri: 'https://staging.project-progress.net/projects/imail/graphql',
        fetch,
    }),
    cache: new InMemoryCache(),
});