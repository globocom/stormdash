import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';
import StormDash from './components/StormDash';
import NotFound from './components/NotFound';


const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/dash/:dashName" component={StormDash} />
    <Route path="*" status={404} component={NotFound} />
  </Router>
);

export default Routes;
