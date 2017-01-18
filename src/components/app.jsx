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
      hasCurrentItem: false,
      items: store('alertItems')
    };

    this.addItem = this.addItem.bind(this);
    this.handleSidebar = this.handleSidebar.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
  }

  render() {
    return (
      <div className="dash-main">
        <Tools
          handleSidebar={this.handleSidebar}
          hasCurrentItem={this.state.hasCurrentItem} />

        <Sidebar
          isOpen={this.state.visibleSidebar}
          handleSidebar={this.handleSidebar} />

        <AlertGroup
          items={this.state.items}
          setCurrent={this.setCurrent}
          clearCurrent={this.clearCurrent} />
      </div>
    )
  }

  handleSidebar(action="open") {
    if (action === "close") {
      this.setState({visibleSidebar: false});
      return;
    }
    this.setState({visibleSidebar: true});
  }

  addItem(alertObj) {
    this.clearCurrent();
    const newItems = this.state.items.concat([alertObj]);
    store('alertItems', newItems);
    this.setState({items: newItems});
  }

  deleteItem(itemId) {
    this.clearCurrent();
    let currentItems = this.state.items.slice();
    let index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === itemId;
    });

    currentItems.splice(index, 1);
    store('alertItems', currentItems);
    this.setState({items: currentItems});
  }

  setCurrent(itemId) {
    let currentItems = this.state.items.slice();
    currentItems.map((item) => {
      if(item.id !== itemId) {
        item.current = false;
      } else {
        item.current = true;
      }
      return item;
    });

    this.setState({hasCurrentItem: true, items: currentItems});
  }

  clearCurrent() {
    let currentItems = this.state.items.slice();
    currentItems.map((item) => {
      item.current = false;
      return item;
    });

    this.setState({hasCurrentItem: false, items: currentItems});
  }
}

export default App;
