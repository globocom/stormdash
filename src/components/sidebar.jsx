import React, { Component } from 'react';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    return (
      <div className="dash-sidebar{}"></div>
    )
  }

}

export default Sidebar;
