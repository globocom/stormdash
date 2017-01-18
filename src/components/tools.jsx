import React, { Component } from 'react';
import '../../style/tools.css';

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onAddItem = this.onAddItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
  }

  render() {
    return (
      <div className="dash-tools">
        {this.props.currentItem && <button onClick={this.onDeleteItem} className="tool-btn delete-alert">Del</button>}
        {this.props.currentItem && <button onClick={this.onAddItem} className="tool-btn edit-alert">Edit</button>}
        <button onClick={this.onEditItem} className="tool-btn add-alert">Add</button>
      </div>
    );
  }

  onAddItem(event) {
    event.stopPropagation();
    this.props.handleSidebar("open");
  }

  onEditItem(event) {
    event.stopPropagation();
    this.props.handleSidebar("open");
  }

  onDeleteItem(event) {
    event.stopPropagation();
    this.props.deleteItem(this.props.currentItem);
  }
}

export default Tools;
