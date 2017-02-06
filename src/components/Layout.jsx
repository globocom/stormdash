'use strict';

import React, { Component } from 'react';


class Layout extends Component {
  render() {
    return (
      <section className="dash-container">{this.props.children}</section>
    );
  }
}

export default Layout;
