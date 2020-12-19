import React, { useState } from 'react';
import Dialogo from '../Dialogo';
import Editor from '../Editor';
import { Grid, Container, Button } from '@material-ui/core';
import { EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';


const Mail = (props) => {
  const { setOpen, open, usermail, candidatemail } = props;
  const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const html = convertToHTML(editorState.getCurrentContent());
  return (
    <Dialogo setOpen={setOpen} open={open} titulo={"Nuevo Mensaje"} >
    	<Container>
	  		{"Hola"}<br/>
	  		{usermail}<br/>
	  		{candidatemail}<br/>
	  		<Editor editorState={editorState} setEditorState={setEditorState}/>
	  		<br/>
	  		<Button color="primary"
	  			onClick={()=>console.log(html)}
	  		>Envíar</Button>
  		</Container>
  	</Dialogo>
  );
}

const Form = (props) => {
  const { setOpen, open } = props;
  return (
    <Dialogo setOpen={setOpen} open={open} titulo={"Envíar email a Candidato"} >
  		{"Hola mail"}
  	</Dialogo>
  );
}

export default Mail;