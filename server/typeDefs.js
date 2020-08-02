'use strict';

module.exports = `
  type Query {
    auth: Boolean!
    hello: String!
  }

  type Mutation {
    acceptToken(token: String!): Boolean!
    mutate: String!
    sendToken(email: String!): String
  }
`;
