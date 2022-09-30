import styles from "./App.module.scss";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import Home from "./beforeLogin/Home";
import Signup from "./beforeLogin/Signup";
import Login from "./beforeLogin/Login";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UnprotectedRoute from "./UnprotectedRoute";
import SelfTraker from "./afterLogin/SelfTraker";
import Activity from "./afterLogin/Activity";
import Today from "./afterLogin/Today";
import ShowNavbar from "./ShowNavbar";

function App() {
  const [isAuth, setisAuth] = useState(false);
  // Sending Request For Checking Authentication
  Axios.defaults.withCredentials = true;
  const AuthUser = () => {
    Axios.get(`${window.server_link}/auth`).then((response) => {
      setisAuth(response.data);
      console.log(response.data);
    });
  };
  useEffect(() => {
    AuthUser();
  });

  return (
    <>
      <ShowNavbar isAuth={isAuth} />
      <Switch>
        <div className={styles.Route}>
          <UnprotectedRoute exact path="/" component={Home} isAuth={isAuth} />
          <UnprotectedRoute
            exact
            path="/signup"
            component={Signup}
            isAuth={isAuth}
          />
          <UnprotectedRoute
            exact
            path="/login"
            component={Login}
            isAuth={isAuth}
          />
          <ProtectedRoute
            exact
            path="/selfTraker"
            component={SelfTraker}
            isAuth={isAuth}
          />
          <ProtectedRoute
            exact
            path="/activity"
            component={Activity}
            isAuth={isAuth}
          />
          <ProtectedRoute
            exact
            path="/today"
            component={Today}
            isAuth={isAuth}
          />
        </div>
      </Switch>
    </>
  );
}

export default App;
