import React, { Component } from 'react';
import AlertItem from './alert_item';
import { uuid, shuffle } from '../utils';
import '../../style/alert_group.css';

const AlertGroup = (props) => {

  const alertItens = props.items.map((alert) => {
    return (
      <AlertItem key={uuid()} alert={alert} />
    );
  });

  return (
    <div className="dash-alert-group">
      {shuffle(alertItens)}
    </div>
  );
}

export default AlertGroup;
