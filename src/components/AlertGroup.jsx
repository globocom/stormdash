'use strict';

import React, { Component } from 'react';
import AlertItem from './AlertItem';
import { checkStatus } from '../utils';


class AlertGroup extends Component {

  render() {
    const gStatus = this.props.groupStatus,
          options = ["critical", "warning", "ok"];
    let alertItems = this.props.items;

    if(gStatus && options.indexOf(gStatus) < 0) {
      console.log(`Invalid item status: ${gStatus}`);
      return <div className="dash-alert-group" />;
    }

    if(gStatus && options.indexOf(gStatus) >= 0) {
      alertItems = this.props.items.filter((alert) => {
        if(checkStatus(alert) === gStatus) {
          return true;
        }
      });
    }

    const allItems = alertItems.map((alert) => {
      return <AlertItem key={alert.id}
                        alert={alert}
                        setCurrent={this.props.setCurrent} />
    });

    if(allItems.length < 1) {
      return null;
    }

    return (
      <div className={"dash-alert-group" + (gStatus ? " "+ gStatus : "")}
           onClick={() => this.props.clearCurrent()}>
        {allItems}
      </div>
    );
  }
}

export default AlertGroup;
