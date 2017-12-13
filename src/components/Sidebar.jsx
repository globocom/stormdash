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
import AlertItem from './AlertItem';
import { uiSocket } from './App';
import { uuid } from '../utils';

import './Sidebar.css';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.socket = uiSocket();

    this.state = {
      id: uuid(),
      current: false,
      currentValue: "",
      namespace: "",
      title: "",
      jsonurl: "",
      mainkey: "",
      ok: {compare: "", value: "", message: ""},
      warning: {compare: "", value: "", message: ""},
      critical: {compare: "", value: "", message: ""},
      show: "value",
      description: "",
      hasAuth: false,
      username: "",
      password: "",
      authHeaders: "",
      reqBody: "",
      reqBodyContentType: "text/plain"
    };

    this.currentId = props.currentItem;
    this.setEditItem(this.currentId);

    this.onCreate = this.onCreate.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onCheckValue = this.onCheckValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveAuth = this.saveAuth.bind(this);
  }

  render() {
    const authentication = (
      <div className="auth">
        <div>
          <label className="topcoat-checkbox has-auth-checkbox">
            <input type="checkbox" name="hasAuth"
              checked={this.state.hasAuth} onChange={this.handleInputChange} />
            <div className="topcoat-checkbox__checkmark"></div>
            &nbsp;Need&nbsp;authentication
          </label>
        </div>

        {this.state.hasAuth &&
          <div>
            <label>Auth Headers</label><br />
            <input type="text" className="topcoat-text-input--large" name="authHeaders"
              value={this.state.authHeaders} onChange={this.handleInputChange} />
          </div>}
      </div>
    );

    return (
      <div className="dash-sidebar">
        <h3 className="title">{this.currentId ? 'Edit Alert' : 'Add Alert'}</h3>

        <button className="close-btn" onClick={() => this.props.handleSidebar("close")}>
          <i className="icon-cancel"></i>
        </button>

        <section className="form-items">
          <div>
            <label>Namespace</label><br />
            <input type="text" className="topcoat-text-input--large" name="namespace"
              value={this.state.namespace} onChange={this.handleInputChange} />
          </div>
          <div>
            <label>Title</label><br />
            <input type="text" className="topcoat-text-input--large" name="title"
              value={this.state.title} onChange={this.handleInputChange} />
          </div>

          <div>
            <label>Json url</label><br />
            <input type="text" className="topcoat-text-input--large" name="jsonurl"
              value={this.state.jsonurl} onChange={this.handleInputChange} />
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

          {!this.currentId && authentication}

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
        </section>

        <section className="form-base">
          <button className="topcoat-button--large" onClick={this.onCheckValue}>Check Status</button>
          {this.currentId
            ? <button className="topcoat-button--large--cta" onClick={this.onEdit}>Save</button>
            : <button className="topcoat-button--large--cta" onClick={this.onCreate}>Create</button>}
        </section>

        <div className="preview">
          <AlertItem alert={this.buildItem()} setCurrent={() => false} />
        </div>
      </div>
    );
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
    this.socket.emit(
      'auth:save',
      {
        itemId: this.state.id,
        dashName: this.props.dashName,
        username: this.state.username,
        password: this.state.password,
        authHeaders: this.state.authHeaders
      },
      (data) => {
        console.log('Save item auth: '+ data);
      });
  }

  onEdit(event) {
    event.preventDefault();
    this.props.editItem(this.currentId, this.buildItem());
    this.props.handleSidebar("close");
  }

  setEditItem(itemId) {
    this.socket.emit('dash:get', {name: this.props.dashName}, (data) => {
      data.items.find((elem) => {
        if(elem.id === itemId) {
          return this.setState(elem);
        }
        return null;
      });
    });
  }

  buildItem() {
    return {
      id: this.state.id,
      current: this.state.current,
      currentValue: this.state.currentValue,
      namespace: this.state.namespace,
      title: this.state.title,
      jsonurl: this.state.jsonurl,
      mainkey: this.state.mainkey,
      ok: this.state.ok,
      warning: this.state.warning,
      critical: this.state.critical,
      show: this.state.show,
      description: this.state.description,
      hasAuth: this.state.hasAuth,
      reqBody: this.state.reqBody,
      reqBodyContentType: this.state.reqBodyContentType
    }
  }

  onCheckValue(event) {
    event.preventDefault();
    this.socket.emit('item:check', this.buildItem(), (value) => {
      this.setState({currentValue: value});
    });
  }
}

export default Sidebar;
