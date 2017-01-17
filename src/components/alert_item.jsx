import React, { Component } from 'react';
import '../../style/alert_item.css';

const AlertItem = (props) => {
  const data = props.alert;

  return (
    <div className={"dash-alert-item " + data.status}>
      <span className="title">{data.namespace}: {data.title}</span><br />
      <strong className="value">{data.value}</strong>
    </div>
  );
}

export default AlertItem;
