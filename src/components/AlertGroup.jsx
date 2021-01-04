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
import AlertItem from './AlertItem';
import './AlertGroup.css';

class AlertGroup extends Component {

  render() {
    let alertItems = this.props.items;
    let allItems = [];
    let hidden = this.props.hidden;

    alertItems.forEach((alert) => {
      if (hidden || !alert.disable) {
        allItems.push(
          <AlertItem
            key={alert.id}
            alert={alert}
            setCurrent={this.props.setCurrent} />
        )
      }
    });

    if(allItems.length < 1) {
      return null;
    }

    return (
      <div className="dash-alert-group-wrapper">
        <div className="dash-alert-group dash-alert-group-scale100"
             onClick={() => this.props.clearCurrent()}>
          {allItems}
        </div>
      </div>
    );
  }

  componentDidMount() {
    // If component's height is too high, "zoom out"
    let element = document.getElementsByClassName("dash-alert-group")[0];

    if (!element) {
      return;
    }

    let height = element.clientHeight;
    let zoom = 100;
    let maxHeight = window.innerHeight * 0.8;

    while (zoom > 10 && height * zoom / 100 > maxHeight) {
      element.classList.remove("dash-alert-group-scale" + zoom);
      zoom = zoom - 10;
      element.classList.add("dash-alert-group-scale" + zoom);
      height = element.clientHeight; // get new height
    }
  }
}

export default AlertGroup;
