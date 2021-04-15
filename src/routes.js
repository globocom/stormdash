/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import App from "./components/App";
import StormDash from "./components/StormDash";
import NotFound from "./components/NotFound";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/dash/:dashName">
          <StormDash />
        </Route>
        <Route path="*" status={404}>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default Routes;
