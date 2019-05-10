import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  pauseSong: PropTypes.func.isRequired,
  nextSong: PropTypes.func.isRequired,
  previousSong: PropTypes.func.isRequired,
  endSong: PropTypes.func.isRequired
}

class SongPlayingControls extends React.Component {
  render() {
    return (
        <div className="song-playing-controls">
          <input
            type='button'
            value='PREV'
            onClick={this.props.previousSong}
          />
          <input
            type='button'
            value='PAUSE'
            onClick={this.props.pauseSong}
          />
          <input
            type='button'
            value='NEXT'
            onClick={this.props.nextSong}
          />
          <input
            type='button'
            value='END'
            onClick={this.props.endSong}
          />
        </div>
    )
  }
}

SongPlayingControls.propTypes = propTypes;

export default SongPlayingControls;
