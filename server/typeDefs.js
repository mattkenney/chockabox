'use strict';

module.exports = `
  type Query {
    auth: Boolean!
    hello: String!
  }

  type Mutation {
    mutate: String!
    sendToken(email: String!): String
  }
`;
