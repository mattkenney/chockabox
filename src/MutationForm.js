import React from 'react';

import { useLocation } from "react-router-dom";

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
