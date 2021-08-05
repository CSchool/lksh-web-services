import React, { Component, Suspense } from 'react';
import NavbarMain from './Navbar/Main';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import fetchBackend, { postBackend } from './Backend/Backend';
import { Shop } from './Prize/Shop';
import AppliedRoute from "./AppliedRoute";
import Login from './Auth/Login';

class NotFound extends Component {
    render() { return "Not found"; }
}
  
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
          isAuthenticated: false,
          isAuthenticating: true,
          username: "",
          user_id: -1,
          tokens: 0,
        };
      }

      logout = () => {
          this.setState({ isAuthenticated: false,
                          isAuthenticating: false,
                          username: "",
                          user_id: -1,
                          tokens: 0, });
      }

      loadSession = () => {
          fetchBackend('auth/user/')
              .then(response => response.json())
              .then(response => {
                  console.log(response);
                  if (response.pk > 0) {
                      this.setState({ isAuthenticated: true,
                                      user_id: response.pk,
                                      username: response.username,
                                      isAuthenticating: false,
                                      tokens: response.tokens });
                  } else {
                      this.logout();
                  }
              })
              .catch(error => this.logout() );
      }

    async componentDidMount() {
        this.loadSession();
    }

    userHasAuthenticated = authenticated => {
        if (!authenticated) {
            postBackend('auth/logout/')
                .catch(error => {})
                .finally(() => this.logout());
        } else {
            this.loadSession();
        }
    }


    render() {
        const childProps = { auth: {
            isAuthenticated: this.state.isAuthenticated,
            username: this.state.username,
            user_id: this.state.user_id,
            tokens: this.state.tokens,
            userHasAuthenticated: this.userHasAuthenticated
        } };

        if (this.state.isAuthenticating) {
            return <div>Authenticating...</div>;
        }

        return (
            <>
                <NavbarMain {...childProps} />
                <Router childProps={childProps}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <AppliedRoute path="/" exact component={Shop}
                                props={childProps} />
                            <AppliedRoute path="/login" exact component={Login}
                                props={childProps} />
                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </Router>
            </>
        );
    }
}

export default App;
