import React, { Component } from 'react';
import AlertItem from './alert_item';
import '../../style/alert_group.css';

const AlertGroup = (props) => {
  const status = props.itemsStatus,
        statusOptions = ["critical", "warning", "ok"];
  let alertItems = props.items;

  if(status && statusOptions.indexOf(status) < 0) {
    console.log(`Invalid item status: ${status}`);
    return <div className="dash-alert-group"></div>;
  }

  if(status && statusOptions.indexOf(status) >= 0) {
    alertItems = props.items.filter((alert) => {
      if(alert.status === status) {
        return true;
      }
    });
  }

  const allItems = alertItems.map((alert) => {
    return (
      <AlertItem key={alert.id} alert={alert} setCurrent={props.setCurrent} />
    )
  });

  return (
    <div className={"dash-alert-group" + (status ? " "+ status : "")}
         onClick={() => props.clearCurrent()}>
      {allItems}
    </div>
  );
}

export default AlertGroup;
