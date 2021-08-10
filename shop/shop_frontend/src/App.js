import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component, Suspense } from 'react';
import NavbarMain from './Navbar/Main';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import fetchBackend, { postBackend } from './Backend/Backend';
import Shop from './Prize/Shop';
import ShopItem from './Prize/ShopItem';
import UserList from './Users/UserList';
import UserInfo from './Users/UserInfo';
import Giveaway from './Prize/Giveaway';
import Owned from './Prize/Owned';
import Givetokens from './Tokens/Givetokens';
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
          is_staff: false,
          username: "",
          user_id: -1,
          tokens: 0,
        };
      }

      logout = () => {
          this.setState({ isAuthenticated: false,
                          isAuthenticating: false,
                          is_staff: false,
                          username: "",
                          user_id: -1,
                          tokens: 0, });
      }

      loadSession = () => {
          fetchBackend('auth/user/', {},
              response =>
              {
                  if (response.pk > 0) {
                      this.setState({ isAuthenticated: true,
                                      user_id: response.pk,
                                      username: response.full_name,
                                      isAuthenticating: false,
                                      is_staff: response.is_staff,
                                      tokens: parseInt(response.profile.tokens) });
                  } else {
                      this.logout();
                  }
              }
          );
      }

    async componentDidMount() {
        this.loadSession();
    }

    userRefresh = authenticated => {
        if (!authenticated) {
            postBackend('auth/logout/', {}, {},
                this.logout);
        } else {
            this.loadSession();
        }
    }


    render() {
        const childProps = { auth: {
            isAuthenticated: this.state.isAuthenticated,
            username: this.state.username,
            user_id: this.state.user_id,
            is_staff: this.state.is_staff,
            tokens: this.state.tokens,
            userRefresh: this.userRefresh
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
                            <AppliedRoute path="/shopitem/:id" exact component={ShopItem}
                                props={childProps} />
                            <AppliedRoute path="/giveaway" exact component={Giveaway}
                                props={childProps} />
                            <AppliedRoute path="/givetokens" exact component={Givetokens}
                                props={childProps} />
                            <AppliedRoute path="/prizes" exact component={Owned}
                                props={childProps} />
                            <AppliedRoute path="/users" exact component={UserList}
                                props={childProps} />
                            <AppliedRoute path="/user/:id" exact component={UserInfo}
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
