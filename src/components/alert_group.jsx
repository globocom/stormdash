import React, { Component } from 'react';
import AlertItem from './alert_item';
import '../../style/alert_group.css';

class AlertGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const status = this.props.itemsStatus,
          statusOptions = ["critical", "warning", "ok"];
    let alertItems = this.props.items;

    if(status && statusOptions.indexOf(status) < 0) {
      console.log(`Invalid item status: ${status}`);
      return <div className="dash-alert-group" />;
    }

    if(status && statusOptions.indexOf(status) >= 0) {
      alertItems = this.props.items.filter((alert) => {
        if(alert.status === status) {
          return true;
        }
      });
    }

    const allItems = alertItems.map((alert) => {
      return <AlertItem key={alert.id} alert={alert} setCurrent={this.props.setCurrent} />
    });

    if(allItems.length < 1) {
      return null;
    }

    return (
      <div className={"dash-alert-group" + (status ? " "+ status : "")}
           onClick={() => this.props.clearCurrent()}>
        {allItems}
      </div>
    );
  }
}

export default AlertGroup;
