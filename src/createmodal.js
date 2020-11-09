import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import {postSession} from './api';

export default function FormListItemDialog({sessionApiUrl, postCreateHook}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState({});
  const [error, setError] = React.useState(null);
  const [name, setSessionName] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleCreate = () => {
    postSession(sessionApiUrl, name).then(
      (result) => {
        setResult(result);
        postCreateHook();
        setOpen(false);
      },
      (error) => {
        setError(error);
      }
    );
  };
  const handleTextFieldChange = (event) => {
    setSessionName(event.target.value);
  };

  return (
    <div>
      <ListItem
        button
        key="New Session"
        onClick={handleClickOpen}
      >
        <ListItemIcon><AddIcon /></ListItemIcon>
        <ListItemText primary="New Session" />
      </ListItem>
      <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Session</DialogTitle>
        <DialogContent>
          {error != null ?
            <DialogContentText>
              There was an error: {error}
            </DialogContentText>
            :
            <div/>
          }
          <DialogContentText>
            To create a new upload session give it a name:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            onChange={handleTextFieldChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}