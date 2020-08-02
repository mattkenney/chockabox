import React, { useContext } from 'react';

import { Redirect, useLocation } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';

const MutationContext = React.createContext({});

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
  const req = useContext(MutationContext);
  const tuple = useMutation(mutation);
  req._mutation = mutation;
  return req._tuple || tuple;
}

export default function MutationForm(props) {
  const { pathname } = useLocation();

  const onSubmit = evt => {
    evt.preventDefault();
    const variables = {};
    const elements = evt.currentTarget.elements;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      if (element.disabled || !element.name) continue;
      variables[element.name] = element.files ? element.files : element.value;
    }
    props.mutate({ variables });
  };

  return (
    <form action={pathname} method="post" onSubmit={onSubmit}>
      {props.children}
    </form>
  );
}

export function MutationSSR(props) {
  return (
    <MutationContext.Provider value={props.request}>
      {props.children}
    </MutationContext.Provider>
  );
}

export function RedirectSSR(props) {
  const req = useContext(MutationContext);
  req._redirect = props.to;
  return <Redirect {...props}/>;
}
