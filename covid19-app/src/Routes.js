import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "Home";
import County from "County";

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/county" exact component={County} props={childProps} />
        <AppliedRoute path="/state" exact component={State} props={childProps} />
    { /* Finally, catch all unmatched routes */}
    <Route component={NotFound} />
  </Switch>;

