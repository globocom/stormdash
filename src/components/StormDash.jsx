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
import { Redirect, useParams } from 'react-router-dom';
import axios from 'axios';

import Tools from './Tools';
import Sidebar from './Sidebar';
import AlertGroup from './AlertGroup';
import { uuid } from '../utils';
import { host } from '../config';

import './StormDash.css';

class StormDashMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashName: this.props.dashName,
      hidden: false,
      visibleSidebar: false,
      currentItem: null,
      items: [],
      show: false,
      notFound: false,
      currentHour: this.getCurrentHour(),
      reloading: false,
      dashUpdate: true
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
    this.changeHidden = this.changeHidden.bind(this);
    this.changeUpdate = this.changeUpdate.bind(this);
  }

  getCurrentHour() {
    const d = new Date();
    return d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  getDashContent() {
    const current = this.state.currentItem;
    const data = {
      name: this.state.dashName
    }

    axios.post(`${host}/api/dash/search`, data)
      .then(response => {
        if (!response.data) {
          this.setState({ notFound: true });
          return;
        }

        this.setState({
          items: response.data.items,
          mainTitle: response.data.name,
          hidden: response.data.hidden,
          show: true
        });

        if (current) {
          this.setCurrent(current);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSidebar(action='open') {
    if (action === 'close') {
      this.setState({visibleSidebar: false});
      return;
    }
    this.setState({visibleSidebar: true});
  }

  addItem(alertObj) {
    this.clearCurrent();
    const newItems = this.state.items.concat([alertObj]);

    const data = {
      name: this.state.dashName,
      hidden: this.state.hidden,
      items: newItems
    }

    axios.post(`${host}/api/dash/update`, data)
      .then(updated => {
        return updated && this.getDashContent();
      })
      .catch(error => {
        console.log(error);
      });
  }

  editItem(item, newAlertObj) {
    this.clearCurrent();
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === item.id;
    });

    if (index >= 0) {
      currentItems[index] = newAlertObj;

      let data = {
        name: this.state.dashName,
        hidden: this.state.hidden,
        items: currentItems
      }

      axios.post(`${host}/api/dash/update`, data)
        .then(updated => {
          return updated && this.getDashContent();
        })
        .catch(error => {
          console.log(error)
        });
    }
  }

  deleteItem(item) {
    this.clearCurrent();
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === item.id;
    });

    if (index >= 0) {
      currentItems.splice(index, 1);

      axios.delete(`${host}/api/dash/itemauth`, { itemId: item.id })
        .then(response => {
          if (response.status === 200) {
            const data = {
              name: this.state.dashName,
              items: currentItems
            }

            axios.post(`${host}/api/dash/update`, data)
              .then(updated => {
                return updated && this.getDashContent();
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  setCurrent(item) {
    let currentItems = this.state.items.slice();

    currentItems.map(i => {
      i.current = i.id == item.id ? true : false;
      return i;
    });

    this.setState({
      currentItem: item,
      items: currentItems
    });
  }

  clearCurrent() {
    let currentItems = this.state.items.slice();

    currentItems.map(item => {
      item.current = false;
      return item;
    });

    this.setState({
      currentItem: null,
      items: currentItems
    });
  }

  changeHidden() {
    let hidden = this.state.hidden;
    this.setState({
      hidden: !hidden
    }, () => {
      const data = {
        name: this.state.dashName,
        hidden: this.state.hidden,
        items: this.state.items
      }

      axios.post(`${host}/api/dash/update`, data)
        .then(updated => {
          return updated && this.getDashContent();
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  changeUpdate() {
    this.endAndStartTimer();
    this.setState({dashUpdate: !this.state.dashUpdate});
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearCurrent();
      this.handleSidebar('close');
    }
  };

  endAndStartTimer() {
    window.clearTimeout(this.timer)
    this.timer = window.setTimeout(() => {
      this.setState({ reloading: false })
    }, 3000)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    this.hourInterval = setInterval(() => {
      if (this.state.dashUpdate) {
        this.endAndStartTimer();
        this.setState({
          currentHour: this.getCurrentHour(),
          reloading: true
        });
        this.getDashContent();
      }
    }, 15 * 1000);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.hourInterval);
  }

  render() {
    if(this.state.notFound) {
      return <Redirect to="/not-found" />;
    }

    if(this.state.show) {
      let { visibleSidebar, reloading } = this.state;

      return (
        <div className="dash-main">
          <Tools currentItem={this.state.currentItem}
                 update={this.state.dashUpdate}
                 dashName={this.state.dashName}
                 dashHour={this.state.currentHour}
                 hidden={this.state.hidden}
                 clearCurrent={this.clearCurrent}
                 deleteItem={this.deleteItem}
                 handleSidebar={this.handleSidebar}
                 changeHidden={this.changeHidden}
                 changeUpdate={this.changeUpdate}
                 visibleSidebar={visibleSidebar}
                 reloading={reloading} />

          {visibleSidebar &&
            <Sidebar currentItem={this.state.currentItem}
                     handleSidebar={this.handleSidebar}
                     addItem={this.addItem}
                     editItem={this.editItem}
                     dashName={this.state.dashName} />}

          <AlertGroup key={uuid()}
                      items={this.state.items}
                      hidden={this.state.hidden}
                      setCurrent={this.setCurrent}
                      clearCurrent={this.clearCurrent} />
        </div>
      )
    }

    return <div className="dash-main"></div>
  }

}

export default function StormDash() {
  let { dashName } = useParams();
  return <StormDashMain dashName={dashName} />;
}
