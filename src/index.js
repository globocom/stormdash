import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StormDash from './components/stormdash';

import '../style/base.css';

ReactDOM.render(
  <StormDash />,
  document.querySelector('.dash-container')
);
