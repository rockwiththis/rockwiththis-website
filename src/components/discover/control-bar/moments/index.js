import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import './stylesheets/moments.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  activeView: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,

}

class Moments extends Component {

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.props.hide);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.props.hide);
  }

  render() {
    return (
        <div
          className={
            'moments-modal' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
        <p className="text">A playlist for all the moments of your life.</p>
        <p className="comingSoon">Coming soon!</p>
        </div>
    )
  }
}

Moments.propTypes = propTypes;

export default Moments
