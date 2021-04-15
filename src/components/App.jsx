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

import React, { Component } from "react";
import axios from "axios";
import DashList from "./DashList";
import { host } from "../config";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashs: [],
      dashName: "",
      input: null,
      visibleList: false,
    };

    this.createNewDash = this.createNewDash.bind(this);
    this.handleList = this.handleList.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.getDashoboards();
  }

  getDashoboards() {
    axios
      .get(`${host}/api/dash/all`)
      .then((response) => {
        this.setState({ dashs: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleList(action = "open") {
    if (action === "close") {
      this.setState({ visibleList: false });
      return;
    }
    this.setState({ visibleList: true });
  }

  createNewDash(event) {
    let btn = event.target,
      name = this.state.dashName;

    btn.disabled = true;

    axios
      .post(`${host}/api/dash/create/`, { name: name })
      .then((response) => {
        if (!response.data) {
          const msg = `Name ${name} already exists`;
          this.state.input.setCustomValidity(msg);
          console.log(msg);

          btn.disabled = false;
          return false;
        }

        this.props.router.push(`/dash/${response.data.name}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  defineName(elem) {
    elem.setCustomValidity("");
    this.setState({ dashName: elem.value, input: elem });
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.handleList("close");
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
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
          <input
            type="text"
            className="create-dash-name topcoat-text-input--large"
            value={this.state.dashName}
            onChange={(e) => this.defineName(e.target)}
            placeholder="Dashboard name"
          />
          <button
            className="create-dash-btn topcoat-button--large--cta"
            onClick={this.createNewDash}
          >
            Create
          </button>
        </div>

        <button
          className="show-all-btn topcoat-button--large--quiet"
          onClick={this.handleList}
        >
          Show all
        </button>

        {this.state.visibleList && (
          <DashList
            dashboards={this.state.dashs}
            handleList={this.handleList}
          />
        )}
      </section>
    );
  }
}

export { App as default };
