import React, { useEffect, useState } from 'react';

import Button from 'react-bulma-components/lib/components/button';
import Notification from 'react-bulma-components/lib/components/notification';
import { Field, Control, Label, Input } from 'react-bulma-components/lib/components/form';
import { useLocation } from "react-router-dom";

import Errors from './Errors';
import MutationForm from './MutationForm';
import { ACCEPT_TOKEN, AUTH, LOGOUT, SEND_TOKEN } from './queries/auth';
import { RedirectSSR, useMutationSSR } from './ServerSideRender';

function useParams() {
  return new URLSearchParams(useLocation().search);
}

export default function Login() {
  const params = useParams();

  if (params.has('token')) {
    return <LoginAcceptToken token={params.get('token')}/>;
  }
  if (params.has('logout')) {
    return <Logout/>;
  }

  return <LoginSendToken/>;
}

function LoginAcceptToken({ token }) {
  const [ acceptToken, { data, error, loading } ] = useMutationSSR(ACCEPT_TOKEN);
  const variables = { token };
  const refetchQueries = [ { query: AUTH } ];
  const effect = () => { acceptToken({ refetchQueries, variables }); };
  useEffect(effect, []);

  if (loading) return null;
  if (error) return <Errors error={error}/>;
  if (!data) return null;
  if (data.acceptToken) return <RedirectSSR to='/'/>;
  return <LoginSendToken message='Sorry, that link is expired or invalid.'/>;
}

function LoginForm({ message }) {
  const [ email, setEmail ] = useState('');

  return (
    <>
      {message &&
        <Notification color='warning'>
          {message}
        </Notification>
      }
      <Notification>
        Enter your email address and we will send you a link to sign in.
      </Notification>
      <Field>
        <Label>Email Address</Label>
        <Control>
          <Input
            name='email'
            onChange={evt => setEmail(evt.target.value)}
            placeholder='jdoe@example.com'
            type='email'
            value={email}
          />
        </Control>
      </Field>
      <Button color='primary' type='submit'>Send Login Link</Button>
    </>
  );
}

function LoginSendToken({ message }) {
  const [ sendToken, { data, error, loading } ] = useMutationSSR(SEND_TOKEN);

  if (loading) return null;
  if (error) return <Errors error={error}/>;
  if (data) return <LoginSent data={data}/>;

  return (
    <MutationForm mutate={sendToken}>
      <LoginForm message={message}/>
    </MutationForm>
  );
}

function LoginSent({ data }) {
  return <div>{`Login link sent to ${data.sendToken}`}</div>;
}

function Logout()
{
  const [ logout, { loading, data, error } ] = useMutationSSR(LOGOUT);
  const refetchQueries = [ { query: AUTH } ];
  const effect = () => { logout({ refetchQueries }); };
  useEffect(effect, []);

  if (loading) return null;
  if (error) return <Errors error={error}/>;
  if (!data) return null;
  return <RedirectSSR to='/login'/>;
}
