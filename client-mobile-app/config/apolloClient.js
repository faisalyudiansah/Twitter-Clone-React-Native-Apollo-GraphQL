import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'
import { getValueFor } from '../helpers/secureStore';

const httpLink = createHttpLink({
    uri: 'https://twitter-clone.faisalyudiansah.site',
})

const authLink = setContext(async (_, { headers }) => {
    const token = await getValueFor('access_token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export default client