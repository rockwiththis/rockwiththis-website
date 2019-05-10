import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  playSong: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
}

class SongWaitingControls extends React.Component {
  render() {
    return (
        <div className="song-waiting-controls">
          <input
            type='button'
            value='PLAY'
            disabled={this.props.isDisabled}
            onClick={this.props.playSong}
          />
        </div>
    )
  }
}

SongWaitingControls.propTypes = propTypes;

export default SongWaitingControls;
