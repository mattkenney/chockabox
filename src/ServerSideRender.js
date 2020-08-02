import React, { useContext } from 'react';

import { Redirect } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';

export const ContextSSR = React.createContext({});

export function ssrMutate(req, client) {
  if (req._mutation) {
    if ((/^POST$/i).test(req.method)) {
      return client.mutate({
        mutation: req._mutation,
        variables: req.body
      }).then(result => (req._tuple = [ null, result ]));
    } else if (Object.keys(req.query).length) {
      return client.mutate({
        mutation: req._mutation,
        variables: req.query
      }).then(result => (req._tuple = [ null, result ]));
    }
  }
}

export function ssrRedirect(req, res, html) {
  if (req._redirect) {
    res.redirect(req._redirect);
    return;
  }
  return html;
}

export function useMutationSSR(mutation)
{
  const req = useContext(ContextSSR);
  const tuple = useMutation(mutation);
  req._mutation = mutation;
  return req._tuple || tuple;
}

export function MutationSSR(props) {
  return (
    <ContextSSR.Provider value={props.request}>
      {props.children}
    </ContextSSR.Provider>
  );
}

export function RedirectSSR(props) {
  const req = useContext(ContextSSR);
  req._redirect = props.to;
  return <Redirect {...props}/>;
}
