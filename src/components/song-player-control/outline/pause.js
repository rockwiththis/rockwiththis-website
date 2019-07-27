import React from 'react';
import PropTypes from 'prop-types';

const blackPauseButtonImage = '/static/images/PAUSE-BUTTON.png';
const whitePauseButtonImage = '/static/images/pauseButtonWhite.png';

class OutlinePauseButton extends React.Component {

  static propTypes = {
    isWhite: PropTypes.bool,
    pauseSong: PropTypes.func.isRequired
  }

  render = () => (
    <img
      src={this.props.isWhite ? whitePauseButtonImage : blackPauseButtonImage}
      className="pauseButton"
      onClick={this.props.pauseSong}
    />
  );
}

export default OutlinePauseButton;
