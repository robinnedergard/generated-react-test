import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage
  const token = localStorage.getItem('auth_token')

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
