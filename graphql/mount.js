const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

module.exports = async function mountGraphQL(app) {
  const server = new ApolloServer({ typeDefs, resolvers, includeStacktraceInErrorResponses: false });
  await server.start();
  app.use('/graphql', express.json(), expressMiddleware(server));
};
