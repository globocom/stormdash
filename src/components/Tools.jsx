/*
Copyright 2017 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Tools.css';

function Tools(props) {
  const [showOptions, setShowOptions] = useState(false);

  const onAddItem = () => {
    props.clearCurrent();
    setShowOptions(false);
    props.handleSidebar('open');
  }

  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  }

  return (
    <div className="dash-tools">

      <div className="dash-tools-left">
        <span className="dash-tools-breadcrumb">
          <Link to="/">StormDash</Link>
          <span className="dash-name">
            &nbsp;&rsaquo;&nbsp;{props.dashName}
          </span>
        </span>
      </div>

      {props.update &&
        <div className="dash-tools-middle">
          {!props.reloading &&
            <span>{props.dashHour}</span>}

          {props.reloading &&
            <span className="updating-spin">
              <i className="fa fa-refresh fa-spin fa-fw"></i>
            </span>}
        </div>}

      {!props.update &&
        <div className="dash-tools-middle">
          <span><i className="fa fa-pause"></i></span>
        </div>}

      <div className="dash-tools-right">
        <button onClick={toggleShowOptions} className="topcoat-button--quiet btn-options"
                disabled={props.visibleSidebar || props.currentItem}>
          <i className="fa fa-cog fa-1x"></i>
        </button>

        <button onClick={onAddItem} className="topcoat-button--cta btn-add-alert"
                disabled={props.visibleSidebar}>
          <i className="fa fa-plus fa-1x"></i>
        </button>
      </div>

      {showOptions && !props.visibleSidebar &&
        <div className="dash-sidebar-overlay"></div>}

      {showOptions && !props.visibleSidebar &&
        <div className="dash-tools-options dash-sidebar">

          <div className="dash-sidebar-header">
            <h3 className="dash-sidebar-title">Options</h3>
            <button className="dash-sidebar-close-btn" onClick={toggleShowOptions}>
              <i className="fa fa-times fa-1x"></i>
            </button>
          </div>

          <ul className="options-list">
            <li>
              <span className="option-name">Show disabled items</span>
              <label className="topcoat-switch">
                <input type="checkbox" className="topcoat-switch__input"
                        checked={props.hidden} onChange={props.changeHidden} />
                <div className="topcoat-switch__toggle"></div>
              </label>
            </li>
            <li>
              <span className="option-name">Dashboard update</span>
              <label className="topcoat-switch">
                <input type="checkbox" className="topcoat-switch__input"
                        checked={props.update} onChange={props.changeUpdate} />
                <div className="topcoat-switch__toggle"></div>
              </label>
            </li>
          </ul>
        </div>}

    </div>
  );

}

export default Tools;
