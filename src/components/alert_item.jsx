import React, { Component } from 'react';
import '../../style/alert_item.css';

class AlertItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let alert = this.props.alert,
        { namespace, title, current } = alert,
        status = this.checkItemStatus(),
        value = alert.currentValue;

    if(alert.show === 'message') {
      value = alert['ok'].message;
    }

    return (
      <div className={"dash-alert-item " + status + (current ? " current" : "")}
           onClick={this.onItemSelect}>
        <span className="alert-title">{namespace}: {title}</span><br />
        <strong className="alert-value">{value}</strong>
      </div>
    );
  }

  checkItemStatus() {
    let alert = this.props.alert;
    let status = {
      'ok': alert.ok,
      'warning': alert.warning,
      'critical': alert.critical
    };

    if(alert.currentValue === "") {
      return '';
    }

    for(let s in status) {
      let c = status[s].compare === '=' ? '==' : status[s].compare;
      if(c !== "" &&
         eval('"'+ alert.currentValue +'"'+ c +'"'+ status[s].value +'"')) {
        return s;
      }
    }

    return '';
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.alert.id);
  }
}

export default AlertItem;
