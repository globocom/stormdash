import React, { Component } from 'react';
import Tools from './Tools';
import Sidebar from './Sidebar';
import AlertGroup from './AlertGroup';
// import NotFound from './NotFound';
import axios from 'axios';
import { uuid, store, traverse } from '../utils';

// import io from 'socket.io-client';


class StormDash extends Component {
  constructor(props) {
    super(props);

    // const dashId = this.props.params.dashId;
    // Search for dashId in store,
    // if not found, on render return a <NotFound />

    // const socket = io();
    // socket.emit('dash conn', dashId);

    this.state = {
      mainTitle: 'Storm',
      visibleSidebar: false,
      currentItem: null,
      groupStatus: ['critical', 'warning', 'ok'],
      items: store('alertItems')
    };

    this.handleSidebar = this.handleSidebar.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
    this.doUpdate = this.doUpdate.bind(this);

    // this.startUpdate();
  }

  render() {
    let { visibleSidebar, groupStatus } = this.state;
    let alertGroups = groupStatus.map((group) => {
      return <AlertGroup key={uuid()}
                         items={this.state.items}
                         groupStatus={group}
                         setCurrent={this.setCurrent}
                         clearCurrent={this.clearCurrent} />
    });

    return (
      <div className="dash-main">
        {!visibleSidebar &&
          <Tools currentItem={this.state.currentItem}
                 clearCurrent={this.clearCurrent}
                 handleSidebar={this.handleSidebar}
                 deleteItem={this.deleteItem}
                 doUpdate={this.doUpdate} />}

        {visibleSidebar &&
          <Sidebar currentItem={this.state.currentItem}
                   handleSidebar={this.handleSidebar}
                   addItem={this.addItem}
                   editItem={this.editItem}
                   checkItemValue={this.checkItemValue} />}

        {alertGroups}

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

  startUpdate() {
    setInterval(() => {
      this.doUpdate();
    }, 10000);
  }

  doUpdate() {
    let currentItems = this.state.items.slice();
    currentItems.map((item) => {
      return this.updateItem(item.id);
    });
  }

  updateItem(itemId) {
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === itemId;
    });

    let item = currentItems[index];
    if (index >= 0) {
      this.checkItemValue(item, (value) => {
        item.currentValue = value;
        this.editItem(item.id, item);
      });
    }
  }

  checkItemValue(itemObj, func) {
    let { jsonurl, mainkey } = itemObj;
    if(jsonurl !== "") {
      axios.get(jsonurl).then((response) => {
        traverse(response.data, (key, value) => {
          if(key === mainkey) {
            func(value);
          }
        });
      }).catch((error) => {
          console.log(error);
      });
    }
  }

  handleKeyDown(event) {
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
