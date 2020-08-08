#!/usr/bin/env node

'use strict';

// set up Express
const express = require('express');
const app = new express();
app.disable('x-powered-by');

// we do not want to serve the empty template directly
// so redirect to /
app.get('/index.html', function (req, res) {
  res.set('Location', '/');
  res.status(302).end();
});

// serve /static/* and other static files
const path = require('path');
const build = path.join(path.dirname(__dirname), 'build');
app.use(express.static(build, { index: false, redirect: false }));

// use cookie session
const config = require('../config.json');
app.use(require('cookie-session')(config.session))

// set up GraphQL
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const merge = require('deepmerge');
let resolvers = require('./resolvers');
resolvers = merge(resolvers, require('./auth')(app));
resolvers = merge(resolvers, require('./decks')(app));
const context = ({ req }) => ({
  login: req.login.bind(req),
  logout: req.logout.bind(req),
  origin: req.protocol + '://' + req.get('host'),
  user: req.user
});
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({ context, schema });
server.applyMiddleware({ app, cors: false });

// server-side render React app
const fs = require('fs');
const ssr = require('../dist/server-side-render').default;
const template = path.join(build, 'index.html');
const root = '<div id="root">';
const [ prelude, coda ] = fs.readFileSync(template, 'utf8').split(root, 2);

app.use(express.urlencoded({ extended: false }));
app.use(function (req, res) {
  ssr(req, res, context({ req }), schema)
    .then(content => {
      if (!content) return;
      const html = [ prelude, root, content, coda ].join('');
      res.send(html);
    })
    .catch(error => {
      res.status(500).send(String(error));
    })
  ;
});

// ready to serve
app.listen({ port: 4000 }, () =>
  console.log('Server ready at http://localhost:4000')
);
