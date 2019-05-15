import React from 'react'
import PropTypes from 'prop-types';

import pauseButton from 'images/PAUSE-BUTTON.png'

const propTypes = {
  pauseSong: PropTypes.func.isRequired
}

class WhitePauseButton extends React.Component {
  render = () => (
    <img
      src={pauseButton}
      className="pauseButton"
      onClick={this.props.pauseSong}
    />
  );
}

WhitePauseButton.propTypes = propTypes;

export default WhitePauseButton;
