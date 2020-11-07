import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Keycloak from 'keycloak-js'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'


const styles = function styles(theme) {
  return ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    title: {
      marginRight: theme.spacing(2),
    },
    subtitle: {
      flexGrow: 1,
    },
  });
};


class SessionList extends Component {
  static propTypes = {
    sessionApiUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      sessionList: [],
      keycloak: null,
      authenticated: false,
      userInfo: undefined,
      error: undefined
    }
    this.updateData = this.updateData.bind(this)
  }

  componentDidMount() {
    const keycloak = Keycloak({
      "realm": "master",
      "url": "https://localhost:8443/auth/",
      "clientId": "react-public",
    });
    keycloak.init({onLoad: 'login-required'}).then(authenticated => {
      keycloak.loadUserInfo().then(userInfo => {
        this.setState({
          userInfo: userInfo,
          keycloak: keycloak,
          authenticated: authenticated
        })
      });
    })
  }

  updateData() {
    const { sessionApiUrl } = this.props;
    fetch(sessionApiUrl+'/login/keycloak', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.state.keycloak.token,
        'Accept': 'application/json'
      }
    })
      .then(
        (result) => {
          console.log(result);
          console.log(result.headers.get('Set-Cookie'));
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            sessionList: [],
            error: error
          });
        }
      )
  }
  render() {
    const { classes, title, sessionApiUrl } = this.props;
    if (this.state.keycloak) {
      if (this.state.authenticated)
        return (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  {title}
                </Typography>
                <Typography variant="h6" className={classes.subtitle}>
                  {sessionApiUrl}
                </Typography>
                <Button color="inherit" onClick={this.updateData}>Refresh</Button>
              </Toolbar>
            </AppBar>
            <Grid container justify="space-between" spacing={3}>
              <Grid item>
                <Paper className={classes.paper}>xs=6</Paper>
              </Grid>
              <Grid item>
                <Paper className={classes.paper}>xs=6</Paper>
              </Grid>
            </Grid>
          </div>
        );
      else
        return (<div>Unable to authenticate!</div>);
    }
    return (
      <div>Initializing Keycloak...</div>
    );
  }
}

export default withStyles(styles)(SessionList);
