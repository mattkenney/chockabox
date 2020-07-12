import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const HELLO = gql`query HELLO { hello }`;

export default function Decks()
{
    const { data, error } = useQuery(HELLO);
    if (error) console.log(error);
    return <div>{ data && data.hello }</div>;
}
