import React, { Component } from 'react';
import Tools from './tools';
import Sidebar from './sidebar';
import AlertGroup from './alert_group';
import axios from 'axios';
import { uuid, shuffle, store, traverse } from '../utils';

class StormDash extends Component {
  constructor(props) {
    super(props);
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
    this.doStatusCheck = this.doStatusCheck.bind(this);

    this.startStatusCheck();
  }

  render() {
    let { visibleSidebar, groupStatus } = this.state;
    let groups = groupStatus.map((group) => {
      return <AlertGroup key={uuid()}
                         items={this.state.items}
                         itemsStatus={group}
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
                 doStatusCheck={this.doStatusCheck} />}

        {visibleSidebar &&
          <Sidebar currentItem={this.state.currentItem}
                   handleSidebar={this.handleSidebar}
                   addItem={this.addItem}
                   editItem={this.editItem}
                   checkItemValue={this.checkItemValue} />}

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

  startStatusCheck() {
    setInterval(() => {
      this.doStatusCheck();
    }, 10000);
  }

  doStatusCheck() {
    this.state.items.map((item) => {
      this.updateItemStatus(item.id);
    });
  }

  updateItemStatus(itemId) {
    let currentItems = this.state.items.slice();
    const index = currentItems.findIndex((elem, i, arr) => {
      return elem.id === itemId;
    });

    let item = currentItems[index];
    if (index >= 0) {
      this.checkItemValue(item, (value) => {
        item.currentValue = value;
        item.status = this.checkItemStatus(item);
        this.editItem(item.id, item);
      });
    }
  }

  checkItemStatus(itemObj) {
    let final = '',
        status = {'ok': itemObj.ok,
                  'warning': itemObj.warning,
                  'critical': itemObj.critical};

    for(let s in status) {
      let v1 = itemObj.currentValue,
          v2 = status[s].value,
          c = status[s].compare === '=' ? '==' : status[s].compare;

      v1 = !!parseInt(v1) ? parseInt(v1) : '"'+ v1 +'"';
      v2 = !!parseInt(v2) ? parseInt(v2) : '"'+ v2 +'"';

      if(c !== "" && eval(v1 + c + v2)) {
        final = s;
      }
    }

    return final;
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
