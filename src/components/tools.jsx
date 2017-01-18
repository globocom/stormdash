import React, { Component } from 'react';
import { uuid } from '../utils';
import '../../style/tools.css';

import { shuffle } from '../utils';

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onAddItem = this.onAddItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
  }

  render() {
    const items = shuffle(
      [{current: false, id: uuid(), namespace: "S3", title: "Max Con", value: "68%", status: "warning"},
       {current: false, id: uuid(), namespace: "CI", title: "Vault", value: "Build Failed", status: "critical"},
       {current: false, id: uuid(), namespace: "CI", title: "FaaS", value: "Build OK", status: "ok"},
       {current: false, id: uuid(), namespace: "FaaS", title: "Used Size", value: "88%", status: "critical"},
       {current: false, id: uuid(), namespace: "S3", title: "404 Status", value: "523 ", status: "warning"},
       {current: false, id: uuid(), namespace: "CI", title: "Swift - QA", value: "Build OK", status: "ok"}]
    );

    return (
      <div className="dash-tools">
        {this.props.hasCurrentItem && <button onClick={this.onAddItem} className="edit-alert-btn">Edit</button>}
        <button onClick={this.onEditItem} className="add-alert-btn">Add</button>
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
}

export default Tools;
