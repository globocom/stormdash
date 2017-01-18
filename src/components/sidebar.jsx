import React, { Component } from 'react';
import '../../style/sidebar.css';

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onCreate = this.onCreate.bind(this);
  }

  render() {
    const compareButtons = (
      <div className="topcoat-button-bar">
        <div className="topcoat-button-bar__item">
          <button className="topcoat-button-bar__button">=</button>
        </div>
        <div className="topcoat-button-bar__item">
          <button className="topcoat-button-bar__button">&lt;</button>
        </div>
        <div className="topcoat-button-bar__item">
          <button className="topcoat-button-bar__button">&gt;</button>
        </div>
      </div>
    );

    return (
      <div className={"dash-sidebar" + (this.props.isOpen ? " open" : "")}>
        <h3 className="title">Add Alert</h3>
        <button className="topcoat-button close-btn"
                onClick={() => this.props.handleSidebar("close")}>Close</button>

        <form action className="form-box add-alert" method="POST">
          <div>
            <label htmlFor="namespace">Namespace</label><br />
            <input type="text" className="topcoat-text-input" />
          </div>
          <div>
            <label htmlFor="title">Title</label><br />
            <input type="text" className="topcoat-text-input" />
          </div>
          <div>
            <label htmlFor="jsonUrl">Json url</label><br />
            <input type="text" className="topcoat-text-input" />
          </div>
          <div>
            <label htmlFor="key">Key</label><br />
            <input type="text" className="topcoat-text-input" />
          </div>
          <div className="compare-item">
            <label htmlFor="valueOk">Value OK</label><br />
            {compareButtons}
            <input type="text" className="topcoat-text-input" />
          </div>
          <div className="compare-item">
            <label htmlFor="valueWarning">Value Warning</label><br />
            {compareButtons}
            <input type="text" className="topcoat-text-input" />
          </div>
          <div className="compare-item">
            <label htmlFor="valueCritical">Value Critical</label><br />
            {compareButtons}
            <input type="text" className="topcoat-text-input" />
          </div>
          <div>
            <label htmlFor="description">Description</label><br />
            <textarea className="topcoat-textarea" rows="6" cols="36"></textarea>
          </div>

          <button className="topcoat-button--large--cta" onClick={this.onCreate}>Create</button>
        </form>

      </div>
    );
  }

  onCreate(event) {
    event.preventDefault();
    console.log("Create");
  }

}

export default Sidebar;
