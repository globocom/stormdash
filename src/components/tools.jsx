import React, { Component } from 'react';
import '../../style/tools.css';

import { shuffle } from '../utils';

const Tools = (props) => {

  const items = shuffle(
    [{namespace: "S3", title: "Max Con", value: "68%", status: "warning"},
     {namespace: "CI", title: "Vault", value: "Build Failed", status: "critical"},
     {namespace: "CI", title: "FaaS", value: "Build OK", status: "ok"},
     {namespace: "FaaS", title: "Used Size", value: "32%", status: "ok"},
     {namespace: "S3", title: "404 Status", value: "523 ", status: "warning"},
     {namespace: "CI", title: "Swift - QA", value: "Build OK", status: "ok"}]
  );

  return (
    <div className="dash-tools">
      <button onClick={() => props.onAddNewAlert(items.shift())} className="add-alert-btn">Add</button>
    </div>
  );

}

export default Tools;
