import gql from 'graphql-tag';

export const ACCEPT_TOKEN = gql`mutation ACCEPT_TOKEN($token: String!) {
  acceptToken(token: $token)
}`;

export const AUTH = gql`query AUTH { auth }`;

export const SEND_TOKEN = gql`mutation SEND_TOKEN($email: String!) {
  sendToken(email: $email)
}`;
