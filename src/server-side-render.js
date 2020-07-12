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

export default function (req, schema) {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema }),
    ssrMode: true
  });

  const app = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url}>
        <App/>
      </StaticRouter>
    </ApolloProvider>
  );

  return getDataFromTree(app)
    .then(() => [
      '<script>',
      'window.__APOLLO_STATE__=',
      serialize(client.extract()),
      '</script>',
      ReactDOMServer.renderToString(app)
    ].join(''));
}