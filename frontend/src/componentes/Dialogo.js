import React from 'react';
import { Dialog, DialogTitle } from '@material-ui/core';

const Dialogo = (props) => {
  const { setOpen, open, children, titulo } = props;
  return (
    <Dialog onClose={()=>setOpen(false)} aria-labelledby="simple-dialog-title" open={open}
    	fullWidth={true} maxWidth={"lg"}>
      <DialogTitle id="simple-dialog-title">{titulo}</DialogTitle>
      {children}
    </Dialog>
  );
}

export default Dialogo;