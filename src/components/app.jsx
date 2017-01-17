import React, { Component } from 'react';
import Tools from './tools';
import Sidebar from './sidebar';
import AlertGroup from './alert_group';
import { store } from '../utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleSidebar: false,
      items: []
    };

    this.onAddNewAlert = this.onAddNewAlert.bind(this);
  }

  render() {
    return (
      <div className="dash-main">
        <Tools onAddNewAlert={this.onAddNewAlert} />
        <Sidebar isOpen={this.state.visibleSidebar} />
        <AlertGroup items={this.state.items} />
      </div>
    )
  }

  showSidebar() {
    this.setState({visibleSidebar: true});
  }

  onAddNewAlert(alert) {
    this.setState({items: this.state.items.concat([alert])});
  }
}

export default App;
