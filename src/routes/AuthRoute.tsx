import * as React from 'react';
import { Redirect, Route, RouteProps } from "react-router-dom";
import dataHandler from "../utils/DataHandler";

export const AuthRoute: React.FC<RouteProps> = ({component: Component, ...rest}) => {
  if (!Component) return null;

  const isAuthenticated = (): boolean => {
    return !!dataHandler.getAccessToken();
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated()) {
          return <Component {...props}/>;
        } else {
          return <Redirect to={{
            pathname: "/",
            state: {
              from: props.location
            }
          }}/>
        }
      }}
    />
  );
};
