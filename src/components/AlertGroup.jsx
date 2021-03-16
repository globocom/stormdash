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

import { useEffect } from 'react';
import { checkStatus } from '../utils';
import AlertItem from './AlertItem';
import './AlertGroup.css';

function AlertGroup(props) {

  useEffect(() => {
    // If component's height is too high, "zoom out"
    let element = document.getElementsByClassName("dash-alert-group")[0];

    if (!element) {
      return;
    }

    // let height = element.clientHeight;
    // let zoom = 100;
    // let maxHeight = window.innerHeight * 0.8;

    // while (zoom > 10 && height * zoom / 100 > maxHeight) {
    //   element.classList.remove("dash-alert-group-scale" + zoom);
    //   zoom = zoom - 10;
    //   element.classList.add("dash-alert-group-scale" + zoom);
    //   height = element.clientHeight; // get new height
    // }
  }, [])

  let items = {
    ok: [],
    warning: [],
    critical: []
  };

  props.items.forEach((alert) => {
    if (props.hidden || !alert.disable) {
        items.[checkStatus(alert)].push(
          <div key={alert.id}>
            <AlertItem alert={alert}
                       setCurrent={props.setCurrent}
                       handleSidebar={props.handleSidebar} />
          </div>
        )
    }
  });

  if(items.length < 1) {
    return null;
  }

  return (
    <div className="dash-alert-group-wrapper" onClick={() => props.clearCurrent()}>
      <div className="dash-alert-group group-grid">
        {items.critical}
        {items.warning}
        {items.ok}
      </div>
    </div>
  )

}

export default AlertGroup;
