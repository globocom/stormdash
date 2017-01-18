import React, { Component } from 'react';
import '../../style/alert_item.css';

class AlertItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let data = this.props.alert;
    let current = data.current ? "current" : "";

    return (
      <div className={"dash-alert-item " + current +" "+  data.status}
           onClick={this.onItemSelect}>
        <span className="title">{data.namespace}: {data.title}</span><br />
        <strong className="value">{data.value}</strong>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.alert.id);
  }
}

export default AlertItem;
