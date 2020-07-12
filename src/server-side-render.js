import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { StaticRouter } from "react-router-dom";

import App from './App';

export default function (req) {
  const app = (
    <StaticRouter location={req.url}>
      <App/>
    </StaticRouter>
  );

  return Promise.resolve(ReactDOMServer.renderToString(app));
}
