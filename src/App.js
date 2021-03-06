import React from 'react';

import 'core-js/web/url-search-params';
import Container from 'react-bulma-components/lib/components/container';
import Section from 'react-bulma-components/lib/components/section';
import { Route, Switch } from 'react-router-dom';

import './App.sass';
import Decks from './Decks';
import Login from './Login';
import Nav from './Nav';
import Upload from './Upload';

function About() {
  return <div>About</div>;
}

function Home() {
  return <div>Welcome!</div>;
}

function Content() {
  return (
    <Section>
      <Container>
        <Switch>
          <Route path="/about" component={About}/>
          <Route path="/login" component={Login}/>
          <Route path="/deck" component={Decks}/>
          <Route path="/upload" component={Upload}/>
          <Route component={Home}/>
        </Switch>
      </Container>
    </Section>
  );
}

export default function App() {
  return (
    <>
      <Nav/>
      <Content/>
    </>
  );
}
