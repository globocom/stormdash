import React from 'react';
import { Link } from 'react-router';

import './NotFound.css';


class NotFoundPage extends React.Component {
  render() {
    return (
      <div className="dash-not-found">
        <div className="not-found-title">
          <h1>
            <span className="status">404</span><br />
            <strong className="message">Dashboard not found!</strong>
          </h1>
          <p>
            <Link to="/" className="topcoat-button--large--quiet">
              &laquo;&nbsp;Go back to home
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
