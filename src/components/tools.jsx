import React, { Component } from 'react';
import '../../style/tools.css';

const Tools = (props) => {

  return (
    <div className="dash-tools">
      <button onClick={() => props.onAddNewAlert()} className="add-alert-btn">Add</button>
    </div>
  );

}

export default Tools;
