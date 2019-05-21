import React from 'react'
import PropTypes from 'prop-types';

import blackPauseButton from 'images/PAUSE-BUTTON.png';
import whitePauseButton from 'images/pauseButtonWhite.png';

class OutlinePauseButton extends React.Component {

  static propTypes = {
    isWhite: PropTypes.bool,
    pauseSong: PropTypes.func.isRequired
  }

  render = () => (
    <img
      src={this.props.isWhite ? whitePauseButton : blackPauseButton}
      className="pauseButton"
      onClick={this.props.pauseSong}
    />
  );
}

export default OutlinePauseButton;
