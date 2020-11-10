import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PublishIcon from '@material-ui/icons/Publish';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {commitSession} from './api';

const useStyles = makeStyles((theme) => ({}));

export default function PublishListItemDialog({sessionApiUrl, session, postCreateHook}) {
  const classes = useStyles();
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
    commitSession(sessionApiUrl, session.session).then(
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
    if (session.complete && session.task_percent >= 100) {
      return (<div/>);
    }
    if (session.complete && session.task_percent < 100) {
      return (errorDialog());
    }
    if (session.processing) {
      return (<div/>);
    }
    return (publishDialog());
  }
  
  const publishDialog = () => {
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
            Are you sure you want to publish the data for {session.name} ({session.session})?
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

  const errorDialog = () => {
    return (
      <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Error in Session</DialogTitle>
        <DialogContent>
          {error != null ?
            <DialogContentText>
              There was an error: {error}
            </DialogContentText>
            :
            <div/>
          }
          {typeof session.exception == 'string' && session.exception.length>0 ?
            <div>
              <DialogContentText>
                There was an error on the backend: 
              </DialogContentText>
              <pre>
                {session.exception}
              </pre>
            </div>
            :
            <div>
              <DialogContentText>
                There was an error but I don't have anything to show you.
              </DialogContentText>
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const buttonOrIcon = () => {
    if (session.complete && session.task_percent >= 100) {
      return (
        <DoneIcon style={{ color: green[500] }} />
      );
    }
    if (session.complete && session.task_percent < 100) {
      return (
        <Button
          onClick={handleClickOpen}
          color="secondary"
        >
          <ErrorIcon />
        </Button>
      );
    }
    if (session.processing) {
      return (<CircularProgress value={session.task_percent} />);
    }
    return (
      <Button
        onClick={handleClickOpen}
      >
        <PublishIcon />
      </Button>
    );
  }

  return (
    <div>
      <ListItemIcon>
        {buttonOrIcon()}
      </ListItemIcon>
      {renderDialog()}
    </div>
  );
}