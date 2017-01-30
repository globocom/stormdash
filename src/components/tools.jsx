import React, { Component } from 'react';
import '../../style/tools.css';

class ConfirmDelete extends Component {
  render() {
    return (
      <div className="confirm-delete">
        <span className="warn-message">Are you sure?</span>
        <button onClick={this.props.onDeleteItem} className="delete-yes">Yes</button>
        <button onClick={this.props.disableConfirm} className="delete-cancel">Cancel</button>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.disableConfirm();
  }
}

class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false
    };
    this.onAddItem = this.onAddItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.disableConfirm = this.disableConfirm.bind(this);
  }

  render() {
    return (
      <div className="dash-tools">
        {this.state.confirmDelete && this.props.currentItem &&
          <ConfirmDelete disableConfirm={this.disableConfirm}
                         onDeleteItem={this.onDeleteItem} />}

        {this.props.currentItem &&
          <button onClick={() => this.setState({confirmDelete: true})} className="tool-btn delete-alert">
            <i className="icon-trash"></i>
          </button>}

        {this.props.currentItem &&
          <button onClick={this.onEditItem} className="tool-btn edit-alert">
            <i className="icon-pencil"></i>
          </button>}

        <button onClick={this.onAddItem} className="tool-btn add-alert">
          <i className="icon-plus"></i>
        </button>
      </div>
    );
  }

  onAddItem(event) {
    event.stopPropagation();
    this.props.clearCurrent();
    this.props.handleSidebar("open");
  }

  onEditItem(event) {
    event.stopPropagation();
    this.props.handleSidebar("open");
  }

  onDeleteItem(event) {
    event.stopPropagation();
    this.props.deleteItem(this.props.currentItem);
    this.disableConfirm();
  }

  disableConfirm() {
    this.setState({confirmDelete: false});
  }
}

export default Tools;
