import React, { Component } from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      dashs: [],
      dashName: "",
      input: null
    };
    this.createNewDash = this.createNewDash.bind(this);
    this.getDashoboards();
  }

  render() {
    let dashboards = this.state.dashs.map((dash) => {
      return (<li>
                <Link to={`/dash/${dash.name}`}>{dash.name}</Link>
                <span className="dash-created-at">{dash.createdAt}</span>
              </li>);
    });

    return (
      <section className="dash-index">
        <div className="dash-index-name">
          <span>Storm</span><br />
          <strong>Dash</strong>
        </div>
        <div className="dash-index-form">
          <label>Name</label><br />
          <input type="text" className="topcoat-text-input--large"
            value={this.state.dashName}
            onChange={e => this.defineName(e.target)} />
          <button onClick={this.createNewDash}>Create</button>
        </div>
        <ul className="dash-index-list">
          {dashboards}
        </ul>
      </section>
    );
  }

  getDashoboards() {
    this.socket.emit('dash:getall', {}, (data) => {
      this.setState({dashs: data});
    });
  }

  createNewDash() {
    this.socket.emit('dash:create', {name: this.state.dashName}, (data) => {
      if(!data) {
        this.state.input.setCustomValidity("Name already exists");
        return false;
      }
      this.getDashoboards();
    });
  }

  defineName(elem) {
    elem.setCustomValidity('');
    this.setState({dashName: elem.value, input: elem});
  }
}

export default App;
