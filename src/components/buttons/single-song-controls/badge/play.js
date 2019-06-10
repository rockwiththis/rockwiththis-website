import React from 'react';
import PropTypes from 'prop-types';

const playButtonImage = '/static/images/playbutton.svg';

class BadgePlayButton extends React.Component {

  static propTypes = {
    playSong: PropTypes.func.isRequired
  }

  render = () => (
    <img
      src={playButtonImage}
      className="playButton"
      onClick={this.props.playSong}
    />
  );
}

export default BadgePlayButton;
