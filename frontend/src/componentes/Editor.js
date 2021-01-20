import React, { useState } from 'react';
//import { Editor } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const MyEditor = ({setEditorState,editorState}) => {
  //const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
 };
return (
  <div>
    <Editor 
      editorState={editorState}
      wrapperClassName="rich-editor demo-wrapper"
      editorClassName="demo-editor"
      onEditorStateChange={onEditorStateChange}
      placeholder="Escriba aquí" />
  </div>
);
}
export default MyEditor;