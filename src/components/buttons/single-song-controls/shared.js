import React from 'react';
import PropTypes from 'prop-types';

export const propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  isActiveSong: PropTypes.bool.isRequired,
  loadedPlayerDurations: PropTypes.objectOf(PropTypes.number).isRequired,
  pauseSong: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired
}

export const getVisibleButton = (props, PauseButton, LoadingButton, PlayButton) => {

  if (this.props.isPlaying && this.props.isActiveSong)
    return <PauseButton pauseSong={props.pauseSong} />;

  else if (!this.props.loadedPlayerDurations)
    return <LoadingButton />;

  else
    return <PlayButton playSong={props.playSong} />;
};
