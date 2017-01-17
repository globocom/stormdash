import React, { Component } from 'react';
import '../../style/sidebar.css';

const Sidebar = (props) => {

  return (
    <div className={"dash-sidebar" + (props.isOpen ? " open" : "")}>
      <span className="title">Add Alert</span>
    </div>
  );

}

export default Sidebar;
