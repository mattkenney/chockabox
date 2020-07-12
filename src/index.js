import React from 'react';

import * as serviceWorker from './serviceWorker';
import App from './App';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from "react-router-dom";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';

const cache = new InMemoryCache();

if (window.__APOLLO_STATE__)
{
    cache.restore(window.__APOLLO_STATE__);
}

const client = new ApolloClient({
  cache,
  link: createUploadLink({ credentials: 'same-origin' })
});

const root = document.getElementById('root');

const app = (
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

if (root.firstChild) {
  ReactDOM.hydrate(app, root);
} else {
  ReactDOM.render(app, root);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
