import React from 'react';
import ReactDOMServer from 'react-dom/server';

import ApolloClient from 'apollo-client';
import serialize from 'serialize-javascript';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';
import { StaticRouter } from "react-router-dom";
import { getDataFromTree } from '@apollo/react-ssr';

import App from './App';
import { ContextSSR, ssrMutate, ssrRedirect } from './ServerSideRender';

export default function (req, res, schema) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({
      context: {
        login: req.login.bind(req),
        origin: req.protocol + '://' + req.get('host'),
        user: req.user
      },
      schema
    }),
    ssrMode: true
  });

  const app = (
    <ApolloProvider client={client}>
      <ContextSSR.Provider value={req}>
        <StaticRouter location={req.url}>
          <App/>
        </StaticRouter>
      </ContextSSR.Provider>
    </ApolloProvider>
  );

  return getDataFromTree(app)
    .then(() => ssrMutate(req, client))
    .then(() => [
      '<script>',
      'window.__APOLLO_STATE__=',
      serialize(client.extract()),
      '</script>',
      ReactDOMServer.renderToString(app)
    ].join(''))
    .then(html => ssrRedirect(req, res, html))
    ;
}
