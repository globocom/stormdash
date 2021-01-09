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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const onAddItem = () => {
    props.clearCurrent();
    setShowOptions(false);
    props.handleSidebar('open');
  }

  const onEditItem = () => {
    props.handleSidebar('open');
  }

  const onDeleteItem = () => {
    props.deleteItem(props.currentItem);
    disableConfirm();
  }

  const disableConfirm = () => {
    setConfirmDelete(false);
  }

  const onShowDelete = () => {
    props.handleSidebar('close');
    setConfirmDelete(true);
  }

  const onShowOptions = () => {
    setShowOptions(!showOptions);
  }

  return (
    <div className="dash-tools">

      {confirmDelete && props.currentItem &&
        <div className="confirm-delete">
          <span className="warn-message">Are you sure?</span>
          <button onClick={onDeleteItem} className="topcoat-button--large">Yes</button>
          <button onClick={disableConfirm} className="topcoat-button--large">No</button>
        </div>}

      <div className="dash-tools-left">
        <span className="dash-tools-breadcrumb">
          <Link to="/">StormDash</Link>
          &nbsp;/&nbsp;
          <span>{props.dashName}</span>
        </span>
      </div>

      <div className="dash-tools-middle">
        {!props.reloading &&
          <span>{props.dashHour}</span>}

        {props.reloading &&
          <span className="text">
            <i className="fa fa-refresh fa-spin fa-fw"></i> updating
          </span>}
      </div>

      <div className="dash-tools-right">
        <button onClick={onShowOptions} className="topcoat-button--quiet"
                disabled={props.visibleSidebar || props.currentItem}>
          <i className="fa fa-cog fa-1x"></i> Options
        </button>

        {showOptions && !props.visibleSidebar &&
          <div className="dash-tools-options">
            <ul className="options-list">
              <li>
                <label className="topcoat-switch">
                  <input type="checkbox" className="topcoat-switch__input"
                         checked={props.hidden} onChange={props.changeHidden} />
                  <div className="topcoat-switch__toggle"></div>
                </label>
                <span className="option-name">Disabled items</span>
              </li>
              <li>
                <label className="topcoat-switch">
                  <input type="checkbox" className="topcoat-switch__input"
                         checked={props.update} onChange={props.changeUpdate} />
                  <div className="topcoat-switch__toggle"></div>
                </label>
                <span className="option-name">Dashboard update</span>
              </li>
            </ul>
          </div>}

        <button onClick={onAddItem} className="topcoat-button--cta add-alert"
                disabled={props.visibleSidebar}>
          <i className="fa fa-plus fa-1x"></i> Add Alert
        </button>
      </div>

      {props.currentItem &&
        <div className="dash-item-tools">
          <div className="dash-tools-left">
            <span className="item-title" title={props.currentItem.title}>
              {props.currentItem.title}
            </span>
          </div>
          <div className="dash-tools-right">
            <button onClick={onEditItem} className="topcoat-button edit-alert">
              <i className="fa fa-pencil fa-1x"></i>&nbsp; Edit
            </button>
            <button onClick={onShowDelete} className="topcoat-button delete-alert">
              <i className="fa fa-trash fa-1x"></i>&nbsp; Delete
            </button>
          </div>
        </div>}

    </div>
  );

}

export default Tools;
