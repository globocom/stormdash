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

import { checkStatus } from '../utils';
import './AlertItem.css';

function AlertItem(props) {

  const onItemSelect = (e) => {
    e.stopPropagation();
    if (props.handleSidebar) {
      props.setCurrent(props.alert);
      props.handleSidebar('open');
    }
  }

  const alert = props.alert;
  const { namespace, title, extlink, current, description } = alert;
  const status = checkStatus(alert);
  const disabled = alert.disable ? " disabled" : "";
  let value = alert.currentValue;

  if (alert.show === 'message' && status !== null) {
    value = alert[status].message.toLowerCase();
  }

  return (
    <div className={"dash-alert-item " + status + disabled + (current ? " current" : "")}
         onClick={onItemSelect} title={description}>
      <span className="alert-title">
        { title || 'title' }
      </span>
      <span className="alert-project">
        <span className="alert-namespace">{ namespace || 'namespace' }</span>
        <span className="alert-status">{ value || 'value' }</span>
      </span>
      {extlink &&
          <a href={extlink} className="ext-link" target="_blank" onClick={e => e.stopPropagation()}>
            <i className="fa fa-external-link"></i>
          </a>}
    </div>
  )

}

export default AlertItem;
