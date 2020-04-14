import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home.js"
import County from "./County.js"
import State from "./State.js"

<Router>
      <div>
        <Switch>
          <Route path="/county" render={() => (<div>County</div>)} />
          <Route path="/state" render={() => (<div>State</div>)} />
          <Route exact path="/" render={() => (<div>Home</div>)} />
          <Route component={NoMatch}/>
        </Switch>
     </div>
  </Router>
