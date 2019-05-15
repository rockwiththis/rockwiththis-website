import React from 'react'
import PropTypes from 'prop-types';

const propTypes = {
  playSong: PropTypes.func.isRequired
}

class WhitePlayButton extends React.Component {
  render = () => (
    <svg
      className="playButton"
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 24 24"
      onClick={this.props.playSong}
    >
      <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"/>
    </svg>
  );
}

WhitePlayButton.propTypes = propTypes;

export default WhitePlayButton;
