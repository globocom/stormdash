import React, { Component } from 'react';
import '../../style/alert_item.css';

class AlertItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    const alert = this.props.alert,
          current = alert.current ? " current" : "";

    let text = alert[alert.status].message;
    if(alert.show === 'value') {
      text = alert[alert.status].value;
    }

    return (
      <div className={"dash-alert-item " + alert.status + current}
           onClick={this.onItemSelect}>
        <span className="title">{alert.namespace}: {alert.title}</span><br />
        <strong className="value">{text}</strong>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.alert.id);
  }
}

export default AlertItem;
