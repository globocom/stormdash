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

import './Tools.css';


class ConfirmDelete extends Component {
  render() {
    return (
      <div className="confirm-delete">
        <span className="warn-message">Are you sure?</span>
        <button onClick={this.props.onDeleteItem} className="delete-yes">Yes</button>
        <button onClick={this.props.disableConfirm} className="delete-no">No</button>
      </div>
    );
  }

  componentDidUpdate() {
    this.props.disableConfirm();
  }

  componentWillUnmount() {
    this.props.disableConfirm();
  }
}

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false
    };
    this.onAddItem = this.onAddItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.disableConfirm = this.disableConfirm.bind(this);
  }

  render() {
    return (
      <div className="dash-tools">
        {this.state.confirmDelete && this.props.currentItem &&
          <ConfirmDelete disableConfirm={this.disableConfirm}
                         onDeleteItem={this.onDeleteItem} />}

        {this.props.currentItem &&
          <button onClick={() => this.setState({confirmDelete: true})} className="tool-btn delete-alert">
            <i className="icon-trash"></i>
          </button>}

        {this.props.currentItem &&
          <button onClick={this.onEditItem} className="tool-btn edit-alert">
            <i className="icon-pencil"></i>
          </button>}

        <button onClick={this.onAddItem} className="tool-btn add-alert">
          <i className="icon-plus"></i>
        </button>
        {/*<button onClick={this.props.doStatusCheck} className="tool-btn check-status">
          <i className="icon-check"></i>
        </button>*/}
      </div>
    );
  }

  onAddItem(event) {
    event.stopPropagation();
    this.props.clearCurrent();
    this.props.handleSidebar("open");
  }

  onEditItem(event) {
    event.stopPropagation();
    this.props.handleSidebar("open");
  }

  onDeleteItem(event) {
    event.stopPropagation();
    this.props.deleteItem(this.props.currentItem);
    this.disableConfirm();
  }

  disableConfirm() {
    this.setState({confirmDelete: false});
  }
}

export default Tools;
