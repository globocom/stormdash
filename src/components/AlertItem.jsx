'use strict';

import React, { Component } from 'react';
import { checkStatus } from '../utils';


class AlertItem extends Component {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let alert = this.props.alert,
        { namespace, title, current } = alert;
    let status = checkStatus(alert);

    let value = alert.currentValue;
    if(alert.show === 'message' && status !== null) {
      value = alert[status].message;
    }

    return (
      <div className={"dash-alert-item " + status + (current ? " current" : "")}
           onClick={this.onItemSelect}>
        <span className="alert-title">{namespace}: {title}</span><br />
        <strong className="alert-value">{value}</strong>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.alert.id);
  }
}

export default AlertItem;
