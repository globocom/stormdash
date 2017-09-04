/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Component } from 'react';
import Tools from './Tools';
import Sidebar from './Sidebar';
import AlertGroup from './AlertGroup';
import NotFound from './NotFound';
import axios from 'axios';
import { uuid, store, traverse } from '../utils';
import io from 'socket.io-client';

import './StormDash.css';

class StormDash extends Component {
  constructor(props) {
    super(props);
    this.socket = io();

    this.state = {
      dashName: this.props.params.dashName,
      visibleSidebar: false,
      currentItem: null,
      groupStatus: ['critical', 'warning', 'ok'],
      items: [],
      show: false,
      notFound: false,
      intervalId: null
    };

    this.getDashContent();

    this.handleSidebar = this.handleSidebar.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  render() {
    if(this.state.notFound) {
      return <NotFound />;
    }

    if(this.state.show) {
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
                   handleSidebar={this.handleSidebar}
                   deleteItem={this.deleteItem}
                   clearCurrent={this.clearCurrent} />}

          {visibleSidebar &&
            <Sidebar currentItem={this.state.currentItem}
                     handleSidebar={this.handleSidebar}
                     addItem={this.addItem}
                     editItem={this.editItem}
                     dashName={this.state.dashName} />}

          {alertGroups}

          <h2 className="main-title">{this.state.dashName}</h2>
        </div>
      )
    }

    return <div className="dash-main"></div>
  }

  getDashContent() {
    const current = this.state.currentItem;
    this.socket.emit('dash:get', {name: this.state.dashName}, (data) => {
      if(!data) {
        this.setState({ notFound: true });
        return;
      }
      this.setState({
        items: data.items,
        mainTitle: data.name,
        show: true
      });
      if(current) {
        this.setCurrent(current);
      }
    });
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
    this.socket.emit(
      'dash:update',
      { name: this.state.dashName, items: newItems },
      (updated) => {
        return updated && this.setState({items: newItems});
      }
    );
  }

  editItem(itemId, newAlertObj) {
    this.clearCurrent();
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === itemId;
    });

    if (index >= 0) {
      currentItems[index] = newAlertObj;
      this.socket.emit(
        'dash:update',
        { name: this.state.dashName, items: currentItems },
        (updated) => {
          return updated && this.setState({items: currentItems});
        }
      );
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
      this.socket.emit(
        'dash:update',
        { name: this.state.dashName, items: currentItems },
        (updated) => {
          return updated && this.setState({items: currentItems});
        }
      );
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
    this.stopUpdate();

    let intervalId = setInterval(() => {
      this.socket.emit('item:checkall', {name: this.state.dashName}, (data) => {
        return data && this.getDashContent();
      });
    }, 10 * 1000);

    this.setState({intervalId: intervalId});
  }

  stopUpdate() {
    clearInterval(this.state.intervalId);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearCurrent();
      this.handleSidebar('close');
    }
  };

  componentDidMount() {
    this.startUpdate();
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    this.stopUpdate();
    document.removeEventListener('keydown', this.handleKeyDown)
  }
}

export default StormDash;
