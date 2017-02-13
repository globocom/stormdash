import React, { Component } from 'react';
import { Link } from 'react-router';

import './DashList.css';


class DashList extends Component {

  render() {
    const dashList = this.props.dashboards.map((dash) => {
      let dashDate = new Date(dash.createdAt),
          numItems = dash.items.length;

      return (
        <li>
          <Link to={`/dash/${dash.name}`}>
            <span className="dash-name">{dash.name}</span><br />
            <span className="dash-created-at">
              Created at {dashDate.toLocaleDateString()}
            </span>
            <span className="dash-items-count">
              {numItems} {numItems == 1 ? 'Item' : 'Items'}
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
