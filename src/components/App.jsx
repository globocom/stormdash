import React, { Component } from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';


class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = { dashs: [] };
    this.createNewDash = this.createNewDash.bind(this);
    this.getDashoboards();
  }

  render() {
    let dashboards = this.state.dashs.map((dash) => {
      return (
        <li><Link to={`/dash/${dash.dashId}`}>{dash.dashId}</Link></li>
      )
    })

    return (
      <section className="index">
        <button onClick={this.createNewDash}>Create</button>
        <ul>
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
    this.socket.emit('dash:create', {}, (data) => {
      this.getDashoboards();
    });
  }
}

export default App;
