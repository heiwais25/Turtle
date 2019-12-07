import React from "react";
import { CssBaseline } from "@material-ui/core";
import { NavigationContainer, MainContainer, TaskDetailContainer } from "pages";
import { Route, Switch } from "react-router-dom";

const Router = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <div style={{ display: "flex" }}>
        <NavigationContainer />
        <Switch>
          <Route path="/detail/:id" component={TaskDetailContainer} />
          <Route path="/" component={MainContainer} />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default Router;
