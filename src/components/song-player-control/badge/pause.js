import React from 'react';
import PropTypes from 'prop-types';

const pauseButtonImage = '/static/images/pauseButton.png';

class BadgePauseButton extends React.Component {

  static propTypes = {
    pauseSong: PropTypes.func.isRequired
  }

  render = () => (
    <img
      src={pauseButtonImage}
      className="pauseButton"
      onClick={this.props.pauseSong}
    />
  );
}

export default BadgePauseButton;
