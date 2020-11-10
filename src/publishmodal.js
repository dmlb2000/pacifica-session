import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PublishIcon from '@material-ui/icons/Publish';
import {commitSession} from './api';

export default function PublishListItemDialog({sessionApiUrl, uuid, name, postCreateHook}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState({});
  const [error, setError] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handlePublish = () => {
    commitSession(sessionApiUrl, uuid).then(
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
        <DialogTitle id="form-dialog-title">Commit Session</DialogTitle>
        <DialogContent>
          {error != null ?
            <DialogContentText>
              There was an error: {error}
            </DialogContentText>
            :
            <div/>
          }
          <DialogContentText>
            Are you sure you want to publish the data?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePublish} color="primary">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <div>
      <ListItemIcon>
        <Button
          onClick={handleClickOpen}
        >
          <PublishIcon />
        </Button>
      </ListItemIcon>
      {renderDialog()}
    </div>
  );
}