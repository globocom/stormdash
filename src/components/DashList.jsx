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
import { Link } from 'react-router';
import './DashList.css';

class DashList extends Component {

  render() {
    const dashList = this.props.dashboards.map((dash, i) => {
      let dashDate = new Date(dash.createdAt),
          numItems = dash.items.length;

      return (
        <li key={'dash'+i}>
          <Link to={`/dash/${dash.name}`}>
            <span className="dash-name">{dash.name}</span><br />
            <span className="dash-created-at">
              Created at {dashDate.toLocaleDateString()}
            </span>
            <span className="dash-items-count">
              {numItems} {numItems === 1 ? 'Item' : 'Items'}
            </span>
          </Link>
        </li>
      )
    });

    return (
      <div className="dash-list">
        <h3 className="title">Dashboards</h3>
        <button className="close-btn" onClick={() => this.props.handleList("close")}>
          <i className="icon-cancel"></i>
        </button>
        <ul className="list-container">
          {dashList}
        </ul>
      </div>
    );
  }
}

export default DashList;
