import React, { Component } from 'react';

class ToggleButton extends Component {

  render() {
    return (
        <button
          className={
            'toggle-button ' +
            this.props.isActive ? 'active ' : 'inactive ' +
            !!this.props.className ? this.props.className : ''
          }
          onClick={this.props.onClick}
          isActive={this.props.isActive}
        >
          {this.props.children}
        </button>
    )
  }
}
