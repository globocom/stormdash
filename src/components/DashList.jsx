import React, { Component } from 'react';
import { Link } from 'react-router';

import './DashList.css';


class DashList extends Component {

  render() {
    const dashList = this.props.dashboards.map((dash) => {
      let dashDate = new Date(dash.createdAt);
      return (
        <li>
          <Link to={`/dash/${dash.name}`}>{dash.name}</Link><br />
          <span className="dash-items-count">{dash.items.length} Items,&nbsp;</span>
          <span className="dash-created-at">
            created at {dashDate.toLocaleDateString()}
          </span>
        </li>
      )
    });

    return (
      <div className="dash-list">
        <h3 className="title">Dashboards</h3>
        <button className="close-btn" onClick={() => this.props.handleList("close")}>
          <i className="icon-cancel"></i>
        </button>
        {dashList}
      </div>
    );
  }
}

export default DashList;
