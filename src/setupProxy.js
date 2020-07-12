'use strict';

const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy4000 = createProxyMiddleware({ target: 'http://localhost:4000' });

module.exports = function (app) {
  // GraphQL
  app.use('/graphql', proxy4000);
};
