import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

// Local Imports
import Welcome from '../../components/Auth/Welcome/index';
import Login from '../../components/Auth/Login/test';
import Signup from '../../components/Auth/Signup/index';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

type Props = {};

type UserData = {
  id: string;
  token: string;
};

const AuthView: React.FC<Props> = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) return;
    const parsedData: UserData = JSON.parse(userData);
    verifyRequest(parsedData.id, parsedData.token);
  }, []);

  // Async Requests
  const verifyRequest = async (id: string, token: string) => {
    let response;
    try {
      response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/verify`, {
        id,
        token
      });
    } catch (error) {
      console.log('[ERROR][AUTH][VERIFY]: ', error);
      return;
    }
    if (!response.data.access) {
      localStorage.removeItem('userData');
      return;
    }
    dispatch({ type: 'LOGIN', payload: { ...response.data.user } });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/" exact component={Welcome} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default AuthView;
