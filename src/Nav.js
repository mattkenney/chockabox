import React from 'react';

import Navbar from 'react-bulma-components/lib/components/navbar';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

const AUTH = gql`query AUTH { auth }`;

export default function Nav() {
  const { data, error } = useQuery(AUTH);
  if (error) console.log(error);
  return (
    <Navbar>
      <Navbar.Brand>
        <NavbarItem><Link to="/">Chockabox</Link></NavbarItem>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          <NavbarItem><Link to="/deck">Decks</Link></NavbarItem>
          <NavbarItem><Link to="/about">About</Link></NavbarItem>
        </Navbar.Container>
        <Navbar.Container position="end">
          {data && !data.auth &&
            <NavbarItem><Link to="/login">Sign In</Link></NavbarItem>
          }
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );
}

function NavbarItem(props) {
  return (
    <Navbar.Item renderAs="span">
      {' '}{props.children}{' '}
    </Navbar.Item>
  );
}