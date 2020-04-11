// import react router
import React from "react";
//import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Link
} from "react-router-dom";

import ReactDOM from "react-dom";

// import componentns
import Home from "./Home";
import County from "./County";
import State from "./State";

export default function App() {
  return (
    <Router>
      <div>
        {/*<nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/county">County</Link>
            </li>
            <li>
              <Link to="/state">State</Link>
            </li>
          </ul>
        </nav>*/}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/county">
            <County />
          </Route>
          <Route path="/state">
            <State />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
