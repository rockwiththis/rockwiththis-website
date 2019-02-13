import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './stylesheets/views-dropdown.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired
}

class ViewsDropdown extends Component {

  constructor(props) {
    super(props);
    this.mainDivRef = React.createRef();
  }

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.hideOnClickOff);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.hideOnClickOff);
  }

  hideOnClickOff = event =>
    this.mainDivRef.current &&
    !this.mainDivRef.current.contains(event.target) &&
    this.props.hide();

  render() {
    return (
        <div
          className={
            'views-dropdown' +
            (this.props.isActive ? '' : ' hidden')
          }
          ref={this.mainDivRef}
        >
          <p>Toggle views here!</p>
        </div>
    )
  }
}

ViewsDropdown.propTypes = propTypes;

export default ViewsDropdown;
