import React, { Component } from 'react';
import AlertItem from './alert_item';
import { uuid, shuffle } from '../utils';
import '../../style/sidebar.css';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "id": uuid(),
      "current": false,
      "status": "ok",
      "namespace": "",
      "title": "",
      "jsonurl": "",
      "mainkey": "",
      "ok": {"compare": "", "value": "", "message": ""},
      "warning": {"compare": "", "value": "", "message": ""},
      "critical": {"compare": "", "value": "", "message": ""},
      "show": "value", // "value" or "message"
      "description": ""
    };

    this.onCreate = this.onCreate.bind(this);
    this.onCheckStatus = this.onCheckStatus.bind(this);
  }

  render() {
    return (
      <div className="dash-sidebar">
        <h3 className="title">{this.props.currentItem ? 'Edit Alert' : 'Add Alert'}</h3>

        <button className="close-btn" onClick={() => this.props.handleSidebar("close")}>
          <i className="icon-cancel"></i>
        </button>

        <section className="form-items">
          <div>
            <label>Namespace</label><br />
            <input type="text" className="topcoat-text-input--large"
              value={this.state.namespace}
              onChange={e => this.setState({"namespace": e.target.value})} />
          </div>
          <div>
            <label>Title</label><br />
            <input type="text" className="topcoat-text-input--large"
              value={this.state.title}
              onChange={e => this.setState({"title": e.target.value})} />
          </div>

          <div>
            <label>Json url</label><br />
            <input type="text" className="topcoat-text-input--large"
              value={this.state.jsonurl}
              onChange={e => this.setState({"jsonurl": e.target.value})} />
          </div>
          <div>
            <label>Key</label><br />
            <input type="text" className="topcoat-text-input--large"
              value={this.state.mainkey}
              onChange={e => this.setState({"mainkey": e.target.value})} />
          </div>

          <div className="compare-item">
            <label>OK</label><br />

            <input type="text" className="topcoat-text-input--large"
              placeholder="operator"
              value={this.state.ok.compare}
              onChange={(e) => {
                  let s = this.state, o = ['=', '>', '<', '>=', '<=', ''];
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

          <div className="compare-item">
            <label>Warning</label><br />

            <input type="text" className="topcoat-text-input--large"
              placeholder="operator"
              value={this.state.warning.compare}
              onChange={(e) => {
                  let s = this.state, o = ['=', '>', '<', '>=', '<=', ''];
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

          <div className="compare-item">
            <label>Critical</label><br />

            <input type="text" className="topcoat-text-input--large"
              placeholder="operator"
              value={this.state.critical.compare}
              onChange={(e) => {
                  let s = this.state, o = ['=', '>', '<', '>=', '<=', ''];
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

          <div>
            <label className="topcoat-radio-button show-radio">
              <input type="radio" name="alert-text" value="value"
                checked={this.state.show === 'value'}
                onChange={e => this.setState({"show": e.target.value})} />
              <div className="topcoat-radio-button__checkmark"></div>
              &nbsp;Show value
            </label>

            <label className="topcoat-radio-button show-radio">
              <input type="radio" name="alert-text" value="message"
                checked={this.state.show === 'message'}
                onChange={e => this.setState({"show": e.target.value})} />
              <div className="topcoat-radio-button__checkmark"></div>
              &nbsp;Show message
            </label>
          </div>

          <div>
            <label>Description</label><br />
            <textarea className="topcoat-textarea"
              value={this.state.description}
              onChange={e => this.setState({"description": e.target.value})}></textarea>
          </div>
        </section>

        <section className="form-base">
          <button className="topcoat-button--large" onClick={this.onCheckStatus}>
            Check Status
          </button>
          <button className="topcoat-button--large--cta" onClick={this.onCreate}>
            Create New Alert
          </button>
        </section>

        <div className="preview">
          <AlertItem alert={this.state}  />
        </div>
      </div>
    );
  }

  onCreate(event) {
    event.preventDefault();
    this.props.addItem(this.state);
    this.props.handleSidebar("close");
  }

  onCheckStatus(event) {
    this.setState({'status': shuffle(['ok', 'warning', 'critical']).shift()});
  }
}

export default Sidebar;
