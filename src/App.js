import React from 'react';

import Container from 'react-bulma-components/lib/components/container';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Section from 'react-bulma-components/lib/components/section';
import { Link, Route, Switch } from 'react-router-dom';

import './App.sass';
import Decks from './Decks';

function About() {
  return <div>About</div>;
}

function Home() {
  return <div>Welcome!</div>;
}

function Nav() {
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

function Content() {
  return (
    <Section>
      <Container>
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/deck" component={Decks}/>
          <Route component={Home}/>
        </Switch>
      </Container>
    </Section>
  );
}

export default function App()
{
  return (
    <>
      <Nav/>
      <Content/>
    </>
  );
}
