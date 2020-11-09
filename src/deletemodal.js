import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import {deleteSession} from './api';

export default function DeleteListItemDialog({sessionApiUrl, name, uuid, postCreateHook}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState({});
  const [error, setError] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    deleteSession(sessionApiUrl, uuid).then(
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
  const renderDialog = () => {
    return (
      <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{name} ({uuid})</DialogTitle>
        <DialogContent>
          {error != null ?
            <DialogContentText>
              There was an error: {error}
            </DialogContentText>
            :
            <div/>
          }
          <DialogContentText>
            <Typography paragraph>
              Delete the session {name} ({uuid})
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Close
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <ListItemIcon>
        <Button
          onClick={handleClickOpen}
        >
          <DeleteIcon />
        </Button>
      </ListItemIcon>
      {renderDialog()}
    </div>
  );
}