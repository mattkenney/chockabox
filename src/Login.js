import React, { useState } from 'react';

import gql from 'graphql-tag';
import Button from 'react-bulma-components/lib/components/button';
import Notification from 'react-bulma-components/lib/components/notification';
import { Field, Control, Label, Input } from 'react-bulma-components/lib/components/form';

import Errors from './Errors';
import MutationForm, { useMutationSSR } from './MutationForm';

const SEND_TOKEN = gql`mutation sendToken($email: String!) { sendToken(email: $email) }`;

export default function Login() {
  const [ sendToken, { data, error, loading } ] = useMutationSSR(SEND_TOKEN);

  if (loading) return null;
  if (error) return <Errors error={error}/>;
  if (data) return <LoginSent data={data}/>;

  return (
    <MutationForm mutate={sendToken}>
      <LoginForm/>
    </MutationForm>
  );
}

function LoginForm() {
  const [ email, setEmail ] = useState('');

  return (
    <>
      <Notification>Enter your email address and we will send you a link to sign in.</Notification>
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

function LoginSent({ data }) {
  return <div>{`Login link sent to ${data.sendToken}`}</div>;
}
