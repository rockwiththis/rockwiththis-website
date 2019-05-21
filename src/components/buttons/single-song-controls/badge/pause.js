import React from 'react';
import PropTypes from 'prop-types';

import pauseButton from 'images/pauseButton.png';

class BadgePauseButton extends React.Component {

  static propTypes = {
    pauseSong: PropTypes.func.isRequired
  }

  render = () => (
    <img
      src={pauseButton}
      className="pauseButton"
      onClick={this.props.pauseSong}
    />
  );
}

export default BadgePauseButton;
