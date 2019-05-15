import React from 'react';
import PropTypes from 'prop-types';

import pauseButton from 'images/pauseButton.png';

const propTypes = {
  pauseSong: PropTypes.func.isRequired
}

class BlackPauseButton extends React.Component {
  render = () => (
    <img
      src={pauseButton}
      className="pauseButton"
      onClick={this.props.pauseSong}
    />
  );
}

BlackPauseButton.propTypes = propTypes;

export default BlackPauseButton;
