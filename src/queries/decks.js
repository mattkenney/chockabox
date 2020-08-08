import gql from 'graphql-tag';

export const UPLOAD_DECK = gql`
mutation UPLOAD_DECK($name: String!, $file: Upload!) {
  uploadDeck(name: $name, file: $file) { filename }
}`;
