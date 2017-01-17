import React, { Component } from 'react';
import '../../style/sidebar.css';

const Sidebar = (props) => {

const sel = <div className="topcoat-button-bar">
            <div className="topcoat-button-bar__item">
            <button className="topcoat-button-bar__button">=</button>
            </div>
            <div className="topcoat-button-bar__item">
            <button className="topcoat-button-bar__button">&lt;</button>
            </div>
            <div className="topcoat-button-bar__item">
            <button className="topcoat-button-bar__button">&gt;</button>
            </div>
            </div>;

  return (
    <div className={"dash-sidebar" + (props.isOpen ? " open" : "")}>
      <span className="title">Add Alert</span>
      <form action className="form-box add-alert" method="POST">
      <div>
        <label for="namespace">Namespace</label><br />
        <input type="text" className="topcoat-text-input" />
      </div>
    <div>
      <label for="title">Title</label><br />
      <input type="text" className="topcoat-text-input" />
    </div>
    <div>
      <label for="jsonUrl">Json url</label><br />
      <input type="text" className="topcoat-text-input" />
    </div>
    <div>
      <label for="key">Key</label><br />
      <input type="text" className="topcoat-text-input" />
    </div>
    <div>
      <label for="valueOk">Value OK</label><br />
      {sel}
      <input type="text" className="topcoat-text-input" />
    </div>
    <div>
      <label for="valueWarning">Value Warning</label><br />
      {sel}
      <input type="text" className="topcoat-text-input" />
    </div>
    <div>
      <label for="valueCritical">Value Critical</label><br />
      {sel}
      <input type="text" className="topcoat-text-input" />
    </div>
    <div>
      <label for="description">Description</label><br />
      <textarea className="topcoat-textarea" rows="6" cols="36"></textarea>
    </div>
    </form>
    </div>
  );

}

export default Sidebar;
