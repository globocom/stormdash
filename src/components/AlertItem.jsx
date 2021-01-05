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

import React, { Component } from 'react';
import { checkStatus } from '../utils';
import './AlertItem.css';

class AlertItem extends Component {

  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  render() {
    let alert = this.props.alert;
    let { namespace, title, extlink, current, description } = alert;
    let status = checkStatus(alert);
    let disable = alert.disable ? " disable" : "";

    let value = alert.currentValue;
    if (alert.show === 'message' && status !== null) {
      value = alert[status].message.toLowerCase();
    }

    return (
      <div className={"dash-alert-item " + status + disable + (current ? " current" : "")}
           onClick={this.onItemSelect} title={description}>
        <span className="alert-title">
          {title}
          {extlink &&
            <a href={extlink} className="ext-link" target="_blank">
              <i className="fa fa-external-link"></i>
            </a>}
        </span>
        <span className="alert-project">
          <span className="alert-namespace">{namespace}</span>
          <span className="alert-status">{value}</span>
        </span>
      </div>
    );
  }

  onItemSelect(event) {
    event.stopPropagation();
    this.props.setCurrent(this.props.alert.id);
  }
}

export default AlertItem;
