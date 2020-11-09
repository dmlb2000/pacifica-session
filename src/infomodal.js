import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InfoIcon from '@material-ui/icons/Info';
import {getSession} from './api';
import { Typography } from '@material-ui/core';

export default function ListItemInfoDialog({sessionApiUrl, uuid}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleCancel = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    getSession(sessionApiUrl, uuid).then(
        (result) => {
            setResult(result);
            setOpen(true);
        },
        (error) => {
            setError(error);
        }
    );
  };

  const renderDialog = () => {
    if (result == undefined || result == null) {
      return (<div/>);
    }
    return (
      <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{result.name} ({result.uuid})</DialogTitle>
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
              This service uses OpenSSH to transfer files. The following is your private
              key to upload data.
            </Typography>
            <Typography variant="subtitle1">Private SSH Key</Typography>
            <pre>
              {result.user_auth.private_key}
            </pre>
            <Typography variant="subtitle1">SSH Command Line Example</Typography>
            <pre>
              sftp -i upload_key.pem {result.user_auth.username}@localhost
            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div>
      <ListItemIcon>
        <Button
          onClick={handleClickOpen}
        >
          <InfoIcon />
        </Button>
      </ListItemIcon>
      {renderDialog()}
    </div>
  );
}