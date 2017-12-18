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
import Navigator from './Navigator';
import Sidebar from './Sidebar';
import AlertGroup from './AlertGroup';
import NotFound from './NotFound';
import { uiSocket } from './App';
import { uuid } from '../utils';

import './StormDash.css';

class StormDash extends Component {
  constructor(props) {
    super(props);
    this.socket = uiSocket();

    this.state = {
      dashName: this.props.params.dashName,
      visibleSidebar: false,
      currentItem: null,
      groupStatus: ['critical', 'warning', 'ok'],
      items: [],
      show: false,
      notFound: false,
      currentHour: this.getCurrentHour()
    };

    this.getDashContent();

    this.handleSidebar = this.handleSidebar.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.clearCurrent = this.clearCurrent.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getCurrentHour = this.getCurrentHour.bind(this);

    this.socket.on('dash:update', (data) => {
      if (data === this.props.params.dashName) {
        this.getDashContent();
      }
    });
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
          <Navigator />

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
          <strong className="dash-hour">{this.state.currentHour}</strong>
        </div>
      )
    }

    return <div className="dash-main"></div>
  }

  getCurrentHour() {
    let d = new Date();
    return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  getDashContent() {
    const current = this.state.currentItem;
    this.socket.emit('dash:get', {name: this.state.dashName}, (data) => {
      if (!data) {
        this.setState({ notFound: true });
        return;
      }
      this.setState({
        items: data.items,
        mainTitle: data.name,
        show: true
      });

      if (current) {
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
        return updated && this.getDashContent();
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
          return updated && this.getDashContent();
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
          return updated && this.getDashContent();
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

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearCurrent();
      this.handleSidebar('close');
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.hourInterval = setInterval(() => {
      this.setState({ currentHour: this.getCurrentHour() });
    }, 15 * 1000);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.hourInterval);
  }
}

export default StormDash;
