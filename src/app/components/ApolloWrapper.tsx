import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WORDPRESS_GRAPHQL_ENDPOINT } from '../lib/config';


const client = new ApolloClient({

    uri: WORDPRESS_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}