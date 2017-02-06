'use strict';

import React from 'react';
import { Link } from 'react-router';


class NotFoundPage extends React.Component {
  render() {
    return (
      <div className="not-found">
        <h1>404</h1>
        <h2>Page not found!</h2>
        <p>
          <Link to="/">Go back to index</Link>
        </p>
      </div>
    );
  }
}

export default NotFoundPage;
