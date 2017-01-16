import React, { Component } from 'react';

const AlertItem = () => {
    return (
        <div>
        <div className="dash-alert-item critical">
            <span className="title">CI: Vault</span>
            <strong className="value">Build Fail</strong>
        </div>
        <div className="dash-alert-item warning">
            <span className="title">CI: FaaS</span>
            <strong className="value">Build Stoped</strong>
        </div>
        <div className="dash-alert-item ok">
            <span className="title">CI: FaaS</span>
            <strong className="value">Build OK</strong>
        </div>
        </div>
    );
}

export default AlertItem;
