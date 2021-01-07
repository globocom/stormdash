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
import { Link } from 'react-router-dom';
import './Tools.css';

class ConfirmDelete extends Component {
  render() {
    return (
      <div className="confirm-delete">
        <span className="warn-message">Are you sure?</span>
        <button onClick={this.props.onDeleteItem} className="topcoat-button--large">Yes</button>
        <button onClick={this.props.disableConfirm} className="topcoat-button--large">No</button>
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
      confirmDelete: false,
      showOptions: false
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.disableConfirm = this.disableConfirm.bind(this);
    this.onShowDelete = this.onShowDelete.bind(this);
    this.onShowOptions = this.onShowOptions.bind(this);
  }

  reset() {
    this.setState({showOptions: false});
    this.props.handleSidebar('close');
  }

  onAddItem(event) {
    event.stopPropagation();
    this.props.clearCurrent();
    this.reset();
    this.props.handleSidebar('open');
  }

  onEditItem(event) {
    event.stopPropagation();
    this.props.handleSidebar('open');
  }

  onDeleteItem(event) {
    event.stopPropagation();
    this.props.deleteItem(this.props.currentItem);
    this.disableConfirm();
  }

  disableConfirm() {
    this.setState({confirmDelete: false});
  }

  onShowDelete() {
    this.props.handleSidebar('close');
    this.setState({confirmDelete: true});
  }

  onShowOptions() {
    this.setState({showOptions: !this.state.showOptions});
  }

  render() {
    return (
      <div className="dash-tools">

        {this.state.confirmDelete && this.props.currentItem &&
            <ConfirmDelete disableConfirm={this.disableConfirm}
                           onDeleteItem={this.onDeleteItem} />}

        <div className="dash-tools-left">
          <span className="dash-tools-breadcrumb">
            <Link to="/">StormDash</Link>
            &nbsp;/&nbsp;
            <span>{this.props.dashName}</span>
          </span>
        </div>

        <div className="dash-tools-middle">
          {!this.props.reloading &&
            <span>{this.props.dashHour}</span>}

          {this.props.reloading &&
            <span className="text">
              <i className="fa fa-refresh fa-spin fa-fw"></i> updating
            </span>}
        </div>

        <div className="dash-tools-right">
          <button onClick={this.onShowOptions} className="topcoat-button--quiet"
                  disabled={this.props.currentItem}>
            <i className="fa fa-cog fa-1x"></i> Options
          </button>

          {this.state.showOptions && !this.props.currentItem &&
            <div className="dash-tools-options">
              <ul className="options-list">
                <li>
                  <label className="topcoat-switch">
                    <input type="checkbox" className="topcoat-switch__input"
                           checked={this.props.hidden} onChange={this.props.changeHidden} />
                    <div className="topcoat-switch__toggle"></div>
                  </label>
                  <span className="option-name">Disabled items</span>
                </li>
                <li>
                  <label className="topcoat-switch">
                    <input type="checkbox" className="topcoat-switch__input"
                           checked={this.props.update} onChange={this.props.changeUpdate} />
                    <div className="topcoat-switch__toggle"></div>
                  </label>
                  <span className="option-name">Dashboard update</span>
                </li>
              </ul>
            </div>}

          <button onClick={this.onAddItem} className="topcoat-button--cta add-alert">
            <i className="fa fa-plus fa-1x"></i> Add Alert
          </button>
        </div>

        {this.props.currentItem &&
          <div className="dash-item-tools">
            <div className="dash-tools-left">
              <span className="item-title" title={this.props.currentItem.title}>
                {this.props.currentItem.title}
              </span>
            </div>
            <div className="dash-tools-right">
              <button onClick={this.onEditItem} className="topcoat-button edit-alert">
                <i className="fa fa-pencil fa-1x"></i>&nbsp; Edit Item
              </button>
              <button onClick={this.onShowDelete} className="topcoat-button delete-alert">
                <i className="fa fa-trash fa-1x"></i>&nbsp; Delete Item
              </button>
            </div>
          </div>}

      </div>
    );
  }

}

export default Tools;
