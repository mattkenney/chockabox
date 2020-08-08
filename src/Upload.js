import React, { useState } from 'react';

import Button from 'react-bulma-components/lib/components/button';
import Icon from 'react-bulma-components/lib/components/icon';
import {
  Field,
  Control,
  Label,
  Input,
  InputFile
} from 'react-bulma-components/lib/components/form';

import Errors from './Errors';
import MutationForm from './MutationForm';
import { UPLOAD_DECK } from './queries/decks';
import { useMutationSSR } from './ServerSideRender';

export default function Upload() {
  const [ uploadDeck, { data, error, loading } ] = useMutationSSR(UPLOAD_DECK);
  if (loading) return null;
  if (error) return <Errors error={error}/>;
  if (data) return <pre>{JSON.stringify(data,null,2)}</pre>;
  return (
    <MutationForm mutate={uploadDeck} upload>
      <UploadForm/>
    </MutationForm>
  );
}

function UploadForm(props) {
  const [ state, setState ] = useState({});
  const onChange = evt => {
    const change =  { [evt.target.name]: evt.target.value };
    setState(state => ({ ...state, ...change }));
  };

  return (
    <>
      <Field>
        <Label>Name</Label>
        <Control>
          <Input name='name' onChange={onChange}  value={state.name}/>
        </Control>
      </Field>
      <Field>
        <Label>Data</Label>
        <Control>
          <InputFile icon={<Icon icon="upload"/>} name='file'/>
        </Control>
      </Field>
      <Button color='primary' type='submit'>Upload</Button>
    </>
  );
}
