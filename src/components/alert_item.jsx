import React, { Component } from 'react';
import '../../style/alert_item.css';

class AlertItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let alert = this.props.alert;
    let { namespace, title, current, status, show } = alert,
        value = alert[status].message;

    if(show === 'value') {
      value = alert.currentValue;
    }

    console.log(alert);

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
