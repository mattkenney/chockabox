'use strict';

module.exports = `
  type Query {
    hello: String!
  }

  type Mutation {
    mutate: String!
    sendToken(email: String!): String
  }
`;
