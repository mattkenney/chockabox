import React from 'react';

import Container from 'react-bulma-components/lib/components/container';
import Navbar from 'react-bulma-components/lib/components/navbar';
import Section from 'react-bulma-components/lib/components/section';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import './App.sass';

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
        <Navbar.Item renderAs='span'><Link to="/">Chockabox</Link></Navbar.Item>
      </Navbar.Brand>
      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item renderAs='span'><Link to="/deck">Decks</Link></Navbar.Item>
          <Navbar.Item renderAs='span'><Link to="/about">About</Link></Navbar.Item>
        </Navbar.Container>
      </Navbar.Menu>
    </Navbar>
  );
}

function Content() {
  return (
    <Section>
      <Container>
        <Switch>
          <Route path="/about" component={About}/>
          <Route component={Home}/>
        </Switch>
      </Container>
    </Section>
  );
}

export default function App()
{
  return (
    <Router>
      <Nav/>
      <Content/>
    </Router>
  );
}
