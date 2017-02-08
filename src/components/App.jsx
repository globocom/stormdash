import React, { Component } from 'react';
import io from 'socket.io-client';
// import { uuid } from '../utils';


class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.createNewDash = this.createNewDash.bind(this);
  }

  render() {
    return (
      <section className="index">
        <button onClick={this.createNewDash}>Create</button>
      </section>
    );
  }

  createNewDash() {
    this.socket.emit('dash:create');
    this.socket.on('dash:created', (data) => {
      console.log(data.id);
    });
  }
}

export default App;
