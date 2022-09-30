import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ isAuth: isAuth, component: Component, ...rest }) => {
  console.log(isAuth);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === true) {
          return <Component />;
        } else {
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
