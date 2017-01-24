import React, { Component } from 'react';
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
  }

  render() {
    const compareButtons = (
      <div className="topcoat-button-bar">
        <div className="topcoat-button-bar__item">
          <button className="topcoat-button-bar__button--large">=</button>
        </div>
        <div className="topcoat-button-bar__item">
          <button className="topcoat-button-bar__button--large">&lt;</button>
        </div>
        <div className="topcoat-button-bar__item">
          <button className="topcoat-button-bar__button--large">&gt;</button>
        </div>
      </div>
    );

    return (
      <div className={"dash-sidebar" + (this.props.isOpen ? " open" : "")}>
        <h3 className="title">Add Alert</h3>
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
            {compareButtons}
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
            {compareButtons}
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
            {compareButtons}
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
          <button className="topcoat-button--large--cta" onClick={this.onCreate}>
            Create New Alert
          </button>
        </section>

      </div>
    );
  }

  onCompareChange(event, key, value) {

  }

  onCreate(event) {
    event.preventDefault();

    // let items = shuffle(
    //   [{current: false, id: uuid(), namespace: "S3", title: "Max Con", value: "68%", status: "warning"},
    //    {current: false, id: uuid(), namespace: "CI", title: "Vault", value: "Build Failed", status: "critical"},
    //    {current: false, id: uuid(), namespace: "CI", title: "FaaS", value: "Build OK", status: "ok"},
    //    {current: false, id: uuid(), namespace: "FaaS", title: "Used Size", value: "88%", status: "critical"},
    //    {current: false, id: uuid(), namespace: "S3", title: "404 Status", value: "523 ", status: "warning"},
    //    {current: false, id: uuid(), namespace: "S3", title: "HTTP Status", value: "200", status: "ok"}]
    // );

    // this.props.addItem(this.state);
    // this.props.handleSidebar("close");

    console.log(this.state);
  }

}

export default Sidebar;
