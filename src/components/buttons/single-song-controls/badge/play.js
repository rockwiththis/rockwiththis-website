import React from 'react';
import PropTypes from 'prop-types';

import playButton from 'images/playbutton.svg';

class BadgePlayButton extends React.Component {

  static propTypes = {
    playSong: PropTypes.func.isRequired
  }

  render = () => (
    <img
      src={playButton}
      className="playButton"
      onClick={this.props.playSong}
    />
  );
}

export default BadgePlayButton;
