import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RefreshIcon from '@material-ui/icons/Refresh';
import { getSessions } from './api';
import FormListItemDialog from './createmodal';
import ListItemInfoDialog from './infomodal';
import DeleteListItemDialog from './deletemodal';
import PublishListItemDialog from './publishmodal';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer({title, sessionApiUrl}) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [sessions, setSession] = React.useState([]);
  const [runUpdate, setUpdate] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const renderSessionList = () => {
    if (sessions == undefined) {
      return (
        <Typography>There was an error: {error}</Typography>
      );
    }
    return sessions.map((session, index) => (
      <ListItem key={session.uuid}>
        <ListItemInfoDialog
          sessionApiUrl={sessionApiUrl}
          uuid={session.session}
        />
        <ListItemText primary={session.name+': ('+session.session+')'} />
        <PublishListItemDialog
          sessionApiUrl={sessionApiUrl}
          session={session}
          postCreateHook={updateSessions}
        />
        <DeleteListItemDialog
          sessionApiUrl={sessionApiUrl}
          uuid={session.session}
          name={session.name}
          postCreateHook={updateSessions}
        />
      </ListItem>
    ));
  }
  const updateSessions = () => {
    getSessions(sessionApiUrl).then(
      (result) => {
        setSession(result);
        var runUpdateAgain = false;
        result.map((xsess, index) => {
          if (xsess.processing) {
            runUpdateAgain = true;
          }
        });
        setUpdate(runUpdateAgain);
        setLoaded(true);
      },
      (error) => {
        setError(error);
        setSession([]);
        setLoaded(true);
      }
    )
  };
  React.useEffect(() => {
    if (!loaded) {
      updateSessions();
    }
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (runUpdate) {
        updateSessions();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <Typography variant="subtitle1" noWrap>
            {sessionApiUrl}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem 
            button
            key="Refresh"
            onClick={updateSessions}
          >
            <ListItemIcon><RefreshIcon /></ListItemIcon>
            <ListItemText primary="Refresh" />
          </ListItem>
          <FormListItemDialog
            sessionApiUrl={sessionApiUrl}
            postCreateHook={updateSessions}
          />
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {loaded ?
        renderSessionList()
        :
        <Typography paragraph>Loading ...</Typography>
        }
      </main>
    </div>
  );
}