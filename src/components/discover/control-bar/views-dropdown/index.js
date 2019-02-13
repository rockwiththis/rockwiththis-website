import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './stylesheets/views-dropdown.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  onFInish: PropTypes.func.isRequired
}

class ViewsDropdown extends Component {

  render() {
    return (
        <div
          className={
            'views-dropdown' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
          <p>Toggle views here!</p>
        </div>
    )
  }
}

ViewsDropdown.propTypes = propTypes;

export default ViewsDropdown;
