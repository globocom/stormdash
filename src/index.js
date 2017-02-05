'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import StormDash from './components/StormDash';

import './static/css/base.css';

ReactDOM.render(
  <StormDash />,
  document.querySelector('.dash-container')
);
