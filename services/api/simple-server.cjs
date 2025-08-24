// Minimal Apollo Server to expose /graphql on port 4000
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Life Story Capsule API is running',
  },
};

async function start() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start().catch((err) => {
  console.error('Failed to start simple GraphQL server:', err);
  process.exit(1);
});


