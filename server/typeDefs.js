'use strict';

module.exports = `
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Mutation {
    acceptToken(token: String!): Boolean!
    logout: Boolean!
    mutate: String!
    sendToken(email: String!): String
    uploadDeck(name: String!, file: Upload!): File!
  }

  type Query {
    auth: Boolean!
    hello: String!
  }
`;
