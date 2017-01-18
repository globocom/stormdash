import React, { Component } from 'react';
import AlertItem from './alert_item';
import '../../style/alert_group.css';

const AlertGroup = (props) => {

  const alertItems = props.items.map((alert) => {
    return (
      <AlertItem
        key={alert.id}
        alert={alert}
        setCurrent={props.setCurrent} />
    );
  });

  return (
    <div className="dash-alert-group" onClick={() => props.clearCurrent()}>
      {alertItems}
    </div>
  );
}

export default AlertGroup;
