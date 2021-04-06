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
import axios from 'axios';
import AlertItem from './AlertItem';
import { uuid } from '../utils';
import { host } from '../config';
import './Sidebar.css';

class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: uuid(),
      current: false,
      currentValue: "",
      title: "",
      namespace: "",
      jsonurl: "",
      extlink: "",
      proxyhost: "",
      proxyport: "",
      coverage: "",
      coveragehost: "",
      coveragefield: "",
      coveragetarget: "",
      mainkey: "",
      ok: {compare: "", value: "", message: ""},
      warning: {compare: "", value: "", message: ""},
      critical: {compare: "", value: "", message: ""},
      show: "value",
      description: "",
      disable: false,
      hasAuth: false,
      username: "",
      password: "",
      authHeaders: "",
      reqBody: "",
      reqBodyContentType: "text/plain",
      confirmDelete: false
    };

    if (props.currentItem) {
      this.setEditItem(props.currentItem);
    }

    this.onCreate = this.onCreate.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCheckValue = this.onCheckValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveAuth = this.saveAuth.bind(this);
    this.onShowDelete = this.onShowDelete.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.closeConfirmDelete = this.closeConfirmDelete.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({[target.name]: value});
  }

  onCreate(event) {
    event.preventDefault();
    this.props.addItem(this.buildItem());

    if(this.state.hasAuth) {
      this.saveAuth();
    }

    this.props.handleSidebar("close");
  }

  saveAuth() {
    const data = {
      itemId: this.state.id,
      dashName: this.props.dashName,
      username: this.state.username,
      password: this.state.password,
      authHeaders: this.state.authHeaders
    }
    axios.post(`${host}/api/auth/save`, data)
      .then(response => {
        console.log('Save item auth: '+ data);
      })
      .catch(error => {
        console.log(error)
      });
  }

  onEdit(event) {
    event.preventDefault();
    this.props.editItem(this.props.currentItem, this.buildItem());
    this.props.handleSidebar("close");
  }

  setEditItem(item) {
    const data = {
      name: this.props.dashName
    }

    axios.post(`${host}/api/dash/search`, data)
      .then(response => {
        response.data.items.find(elem => {
          if(elem.id === item.id) {
            return this.setState(elem);
          }
          return null;
        });
      })
      .catch(error => {
        console.log(error)
      });
  }

  buildItem() {
    return {
      id: this.state.id,
      current: this.state.current,
      currentValue: this.state.currentValue,
      title: this.state.title,
      namespace: this.state.namespace,
      jsonurl: this.state.jsonurl,
      extlink: this.state.extlink,
      proxyhost: this.state.proxyhost,
      proxyport: this.state.proxyport,
      coverage: this.state.coverage,
      coveragehost: this.state.coveragehost,
      coveragefield: this.state.coveragefield,
      coveragetarget: this.state.coveragetarget,
      mainkey: this.state.mainkey,
      ok: this.state.ok,
      warning: this.state.warning,
      critical: this.state.critical,
      show: this.state.show,
      description: this.state.description,
      disable: this.state.disable,
      hasAuth: this.state.hasAuth,
      reqBody: this.state.reqBody,
      reqBodyContentType: this.state.reqBodyContentType
    }
  }

  onCheckValue(event) {
    event.preventDefault();

    axios.get(`${host}/api/item/check`, this.buildItem())
      .then(response => {
        this.setState({currentValue: response.data.value});
      })
      .catch(error => {
        console.log(error)
      });
  }

  onShowDelete() {
    this.setState({ confirmDelete: true });
  }

  onDeleteItem() {
    this.props.deleteItem(this.props.currentItem);
    this.closeConfirmDelete();
    this.props.handleSidebar("close")
  }

  closeConfirmDelete() {
    this.setState({ confirmDelete: false });
  }

  render() {
    const authentication = (
      <div className="form-auth">
        <div className="form-auth-title">
          <label className="topcoat-checkbox has-auth-checkbox">
            <input type="checkbox" name="hasAuth"
              checked={this.state.hasAuth} onChange={this.handleInputChange} />
            <div className="topcoat-checkbox__checkmark"></div>
            &nbsp;With&nbsp;Authentication
          </label>
        </div>

        {this.state.hasAuth &&
          <div className="sub-form">
            <label>Authentication Headers</label><br />
            <input type="text" className="topcoat-text-input--large" name="authHeaders"
              value={this.state.authHeaders} onChange={this.handleInputChange} />
          </div>}
      </div>
    );

    return (
      <div className={'dash-sidebar' + (this.props.currentItem ? ' editing' : '')}>

        <div className="dash-sidebar-header">
          <h3 className="dash-sidebar-title">
            {this.props.currentItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button className="dash-sidebar-close-btn" onClick={() => this.props.handleSidebar("close")}>
            <i className="fa fa-times fa-1x"></i>
          </button>
        </div>

        <section className="form-items">
          <div>
            <label>Title</label><br />
            <input type="text" className="topcoat-text-input--large" name="title"
              value={this.state.title} onChange={this.handleInputChange} />
          </div>

          <div>
            <label>Namespace</label><br />
            <input type="text" className="topcoat-text-input--large" name="namespace"
              value={this.state.namespace} onChange={this.handleInputChange} />
          </div>

          <div>
            <label>Json url</label><br />
            <input type="text" className="topcoat-text-input--large" name="jsonurl"
              value={this.state.jsonurl} onChange={this.handleInputChange} />
          </div>

          <div>
            <label>External url</label><br />
            <input type="text" className="topcoat-text-input--large" name="extlink"
              value={this.state.extlink} onChange={this.handleInputChange} />
          </div>

          <div className="proxy-item">
            <label>Proxy</label>
            <div className="rule">
              <input
                type="text"
                className="topcoat-text-input--large host"
                placeholder="url"
                name="proxyhost"
                value={this.state.proxyhost}
                onChange={this.handleInputChange} />
              <input
                type="text"
                className="topcoat-text-input--large port"
                placeholder="port"
                name="proxyport"
                value={this.state.proxyport}
                onChange={this.handleInputChange} />
            </div>
          </div>

          <div className="coverage-item">
            <label>Coverage</label>
            <div className="rule">
              <input
                type="text"
                className="topcoat-text-input--large host"
                placeholder="url"
                name="coveragehost"
                value={this.state.coveragehost}
                onChange={this.handleInputChange} />
              <input
                type="text"
                className="topcoat-text-input--large field"
                placeholder="field"
                name="coveragefield"
                value={this.state.coveragefield}
                onChange={this.handleInputChange} />
              <input
                type="text"
                className="topcoat-text-input--large target"
                placeholder="target"
                name="coveragetarget"
                value={this.state.coveragetarget}
                onChange={this.handleInputChange} />
            </div>
          </div>

          <div>
            <label className="topcoat-radio-button req-body-radio">
              <input type="radio" name="reqBodyContentType" value="text/plain"
                checked={this.state.reqBodyContentType === 'text/plain'}
                onChange={this.handleInputChange} />
              <div className="topcoat-radio-button__checkmark"></div>
              &nbsp;Request Body as Text
            </label>
            <label className="topcoat-radio-button req-body-radio">
              <input type="radio" name="reqBodyContentType" value="application/json"
                checked={this.state.reqBodyContentType === 'application/json'}
                onChange={this.handleInputChange} />
              <div className="topcoat-radio-button__checkmark"></div>
              &nbsp;Request Body as JSON
            </label>
            <br />
            <textarea className="topcoat-textarea" name="reqBody"
              value={this.state.reqBody} onChange={this.handleInputChange}></textarea>
          </div>

          {!this.props.currentItem && authentication}

          <div>
            <label>Key</label><br />
            <input type="text" className="topcoat-text-input--large" name="mainkey"
              value={this.state.mainkey} onChange={this.handleInputChange} />
          </div>

          <div className="compare-item">
            <label>OK</label>
            <div className="rule">
              <input type="text" className="topcoat-text-input--large"
                placeholder="operator"
                value={this.state.ok.compare}
                onChange={(e) => {
                  let s = this.state,
                      o = ['=', '!', '!=', '>', '<', '>=', '<=', ''];
                  if(o.indexOf(e.target.value) >= 0) {
                    s.ok.compare = e.target.value;
                  }
                  this.setState(s);
                }} />

              <input type="text" className="topcoat-text-input--large"
                placeholder="value"
                value={this.state.ok.value}
                onChange={(e) => {
                  let s = this.state;
                  s.ok.value = e.target.value;
                  this.setState(s);
                }} />

              <input type="text" className="topcoat-text-input--large"
                placeholder="default message"
                value={this.state.ok.message}
                onChange={(e) => {
                  let s = this.state;
                  s.ok.message = e.target.value;
                  this.setState(s);
                }} />
            </div>
          </div>

          <div className="compare-item">
            <label>Warning</label>
            <div className="rule">
              <input type="text" className="topcoat-text-input--large"
                placeholder="operator"
                value={this.state.warning.compare}
                onChange={(e) => {
                  let s = this.state,
                      o = ['=', '!', '!=', '>', '<', '>=', '<=', ''];
                  if(o.indexOf(e.target.value) >= 0) {
                    s.warning.compare = e.target.value;
                  }
                  this.setState(s);
                }} />

              <input type="text" className="topcoat-text-input--large"
                placeholder="value"
                value={this.state.warning.value}
                onChange={(e) => {
                  let s = this.state;
                  s.warning.value = e.target.value;
                  this.setState(s);
                }} />

              <input type="text" className="topcoat-text-input--large"
                placeholder="default message"
                value={this.state.warning.message}
                onChange={(e) => {
                  let s = this.state;
                  s.warning.message = e.target.value;
                  this.setState(s);
                }} />
            </div>
          </div>

          <div className="compare-item">
            <label>Critical</label><br />
            <div className="rule">
              <input type="text" className="topcoat-text-input--large"
                placeholder="operator"
                value={this.state.critical.compare}
                onChange={(e) => {
                  let s = this.state,
                      o = ['=', '!', '!=', '>', '<', '>=', '<=', ''];
                  if(o.indexOf(e.target.value) >= 0) {
                    s.critical.compare = e.target.value;
                  }
                  this.setState(s);
                }} />

              <input type="text" className="topcoat-text-input--large"
                placeholder="value"
                value={this.state.critical.value}
                onChange={(e) => {
                  let s = this.state;
                  s.critical.value = e.target.value;
                  this.setState(s);
                }} />

              <input type="text" className="topcoat-text-input--large"
                placeholder="default message"
                value={this.state.critical.message}
                onChange={(e) => {
                  let s = this.state;
                  s.critical.message = e.target.value;
                  this.setState(s);
                }} />
            </div>
          </div>

          <div>
            <label className="topcoat-radio-button show-radio">
              <input type="radio" name="show" value="value"
                checked={this.state.show === 'value'} onChange={this.handleInputChange} />
              <div className="topcoat-radio-button__checkmark"></div>
              &nbsp;Show value
            </label>

            <label className="topcoat-radio-button show-radio">
              <input type="radio" name="show" value="message"
                checked={this.state.show === 'message'} onChange={this.handleInputChange} />
              <div className="topcoat-radio-button__checkmark"></div>
              &nbsp;Show message
            </label>
          </div>

          <div>
            <label>Description</label><br />
            <textarea className="topcoat-textarea" name="description"
              value={this.state.description} onChange={this.handleInputChange}></textarea>
          </div>

          <div>
            <label className="topcoat-checkbox">
              <input
                type="checkbox"
                name="disable"
                onChange={this.handleInputChange}
                checked={this.state.disable} />
              <div className="topcoat-checkbox__checkmark"></div>
              &nbsp;Disable
            </label>
          </div>
        </section>

        <section className="form-base">
          {this.props.currentItem &&
            <button onClick={this.onShowDelete}
                    className="delete-btn btn-danger topcoat-button--large">Delete</button>}

          <button className="topcoat-button--large" onClick={this.onCheckValue}
                  disabled={this.state.confirmDelete}>Check Status</button>
          {this.props.currentItem
            ? <button className="topcoat-button--large--cta" onClick={this.onEdit}
                      disabled={this.state.confirmDelete}>Save</button>
            : <button className="topcoat-button--large--cta" onClick={this.onCreate}>Create</button>}
        </section>

        {this.state.confirmDelete && this.props.currentItem &&
          <div className="confirm-delete">
            <span className="warn-message">Are you sure?</span>
            <button onClick={this.onDeleteItem} className="topcoat-button--large">Yes</button>
            <button onClick={this.closeConfirmDelete} className="topcoat-button--large">No</button>
          </div>}

        <div className="preview">
          <AlertItem alert={this.buildItem()} setCurrent={() => false} />
        </div>
      </div>
    );
  }

}

export default Sidebar;
