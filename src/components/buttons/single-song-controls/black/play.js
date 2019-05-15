import React from 'react';
import PropTypes from 'prop-types';

import playButton from 'images/playbutton.svg';

const propTypes = {
  playSong: PropTypes.func.isRequired
}

class BlackPlayButton extends React.Component {
  render = () => (
    <img
      src={playButton}
      className="playButton"
      onClick={this.props.playSong}
    />
  );
}

BlackPlayButton.propTypes = propTypes;

export default BlackPlayButton;
