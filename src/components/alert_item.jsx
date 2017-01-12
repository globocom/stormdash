import React, { Component } from 'react';

const AlertItem = () => {
    return (
        <div className="dash-alert-item">
            <span className="title">CI: Vault</span>
            <strong className="value">Build Fail</strong>
        </div>
    );
}

export default AlertItem;
