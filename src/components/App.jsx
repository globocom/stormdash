import React, { Component } from 'react';
import io from 'socket.io-client';
import DashList from './DashList';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    this.state = {
      dashs: [],
      dashName: "",
      input: null,
      visibleList: false
    };

    this.createNewDash = this.createNewDash.bind(this);
    this.handleList = this.handleList.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.getDashoboards();
  }

  render() {
    return (
      <section className="dash-index">
        <div className="dash-index-title">
          <h1>
            <span className="storm">Storm</span>
            <span className="dash">Dash</span>
          </h1>
        </div>
        <div className="dash-index-form">
          <input type="text" className="create-dash-name topcoat-text-input--large"
            value={this.state.dashName}
            onChange={e => this.defineName(e.target)}
            placeholder="Dashboard name" />
          <button className="create-dash-btn topcoat-button--large--cta"
                  onClick={this.createNewDash}>Create</button>
        </div>

        <button className="show-all-btn topcoat-button--large--quiet"
                onClick={this.handleList}>Show all</button>

        {this.state.visibleList &&
          <DashList dashboards={this.state.dashs}
                    handleList={this.handleList} />}
      </section>
    );
  }

  getDashoboards() {
    this.socket.emit('dash:getall', {}, (data) => {
      this.setState({dashs: data});
    });
  }

  handleList(action="open") {
    if (action === "close") {
      this.setState({visibleList: false});
      return;
    }
    this.setState({visibleList: true});
  }

  createNewDash(event) {
    let btn = event.target,
        name = this.state.dashName;

    btn.disabled = true;

    this.socket.emit('dash:create', {name: name}, (data) => {
      if(!data) {
        const msg = `Name ${name} already exists`;
        this.state.input.setCustomValidity(msg);
        console.log(msg);

        btn.disabled = false;
        return false;
      }

      this.props.router.push(`/dash/${data.name}`);
    });
  }

  defineName(elem) {
    elem.setCustomValidity('');
    this.setState({dashName: elem.value, input: elem});
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleList('close');
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

}

export default App;
