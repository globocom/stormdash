import React, { Component } from 'react';
import Tools from './tools';
import Sidebar from './sidebar';
import AlertItem from './alert_item'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleSidebar: false
    };
  }

  render() {
    return (
      <div className="dash-main">
        <Tools />
        <Sidebar isOpen={this.state.visibleSidebar} />
        <AlertItem />
      </div>
    )
  }
}

export default App;
