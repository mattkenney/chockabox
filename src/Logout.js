import React, { useEffect } from 'react';

import Notification from 'react-bulma-components/lib/components/notification';

import Errors from './Errors';
import { useMutationSSR } from './ServerSideRender';

import { AUTH, LOGOUT } from './auth';

export default function Logout()
{
  const [ logout, { loading, data, error } ] = useMutationSSR(LOGOUT);
  const refetchQueries = [ { query: AUTH } ];
  const effect = () => { logout({ refetchQueries }); };
  useEffect(effect, []);

  if (loading) return null;
  if (error) return <Errors error={error}/>;
  if (!data) return null;
  return <Notification>Signed out!</Notification>;
}
