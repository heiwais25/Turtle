import React from "react";
import { NavigationContainer, MainContainer } from "pages";
import { Route, Switch } from "react-router-dom";

const Router = () => {
  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        <NavigationContainer />
        <Switch>
          <Route path="/" component={MainContainer} />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default Router;
