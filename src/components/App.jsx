import React, { Component } from 'react';
import io from 'socket.io-client';


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
    this.socket.emit('dash:create', {}, (data) => {
      console.log(data);
    });
  }
}

export default App;
