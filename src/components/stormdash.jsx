import React, { Component } from 'react';
import Tools from './tools';
import Sidebar from './sidebar';
import AlertGroup from './alert_group';
import { store, uuid, shuffle } from '../utils';

class StormDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainTitle: 'Storm',
      visibleSidebar: false,
      currentItem: null,
      groups: ['critical', 'warning', 'ok'],
      items: store('alertItems')
    };

    this.handleSidebar = this.handleSidebar.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
  }

  render() {
    const groups = this.state.groups.map((group) => {
      return <AlertGroup key={uuid()}
                         items={this.state.items}
                         itemsStatus={group}
                         setCurrent={this.setCurrent}
                         clearCurrent={this.clearCurrent} />
    });

    return (
      <div className="dash-main">
        <Tools currentItem={this.state.currentItem}
               clearCurrent={this.clearCurrent}
               handleSidebar={this.handleSidebar}
               deleteItem={this.deleteItem} />

        {this.state.visibleSidebar &&
          <Sidebar currentItem={this.state.currentItem}
                   handleSidebar={this.handleSidebar}
                   addItem={this.addItem}
                   editItem={this.editItem} />}

        {groups}

        <h2 className="main-title">{this.state.mainTitle}</h2>
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

  editItem(itemId, newAlertObj) {
    this.clearCurrent();
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === itemId;
    });

    if (index >= 0) {
      currentItems[index] = newAlertObj;
      store('alertItems', currentItems);
      this.setState({items: currentItems});
    }
  }

  deleteItem(itemId) {
    this.clearCurrent();
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === itemId;
    });

    if (index >= 0) {
      currentItems.splice(index, 1);
      store('alertItems', currentItems);
      this.setState({items: currentItems});
    }
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

    this.setState({
      currentItem: itemId,
      items: currentItems
    });
  }

  clearCurrent() {
    let currentItems = this.state.items.slice();

    currentItems.map((item) => {
      item.current = false;
      return item;
    });

    this.setState({
      currentItem: null,
      items: currentItems
    });
  }

  doStatusCheck() {
    let currentItems = this.state.items.slice();

    currentItems.map((item) => {
      item.status = this.checkItemStatus(item);
    });

    store('alertItems', currentItems);
    this.setState({items: currentItems});
  }

  checkItemStatus(itemObj) {
    return shuffle(['ok', 'warning', 'critical']).shift();
  }

  handleKeyDown = (event) => {
    let { key } = event;

    if (key === 'Escape') {
      event.preventDefault();
      this.clearCurrent();
      this.setState({visibleSidebar: false});
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
}

export default StormDash;
