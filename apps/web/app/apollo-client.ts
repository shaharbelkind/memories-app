'use client';
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';

const httpLink = createHttpLink({
  uri: API_URL,
  fetchOptions: { mode: 'cors' },
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
  return { headers: { ...headers, authorization: token ? `Bearer ${token}` : '' } };
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) console.error('[Apollo networkError]', networkError);
  if (graphQLErrors) console.error('[Apollo graphQLErrors]', graphQLErrors);
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

if (typeof window !== 'undefined') {
  console.log('[StoryNest] NEXT_PUBLIC_API_URL =', API_URL);
}
