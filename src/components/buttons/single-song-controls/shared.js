import React from 'react';
import PropTypes from 'prop-types';

export const propTypes = {
  isPlaying: PropTypes.bool.isRequired,
  isActiveSong: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  pauseSong: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired
}

export const getVisibleButton = (props, PauseButton, LoadingButton, PlayButton) => {

  if (props.isPlaying && props.isActiveSong)
    return <PauseButton pauseSong={props.pauseSong} isWhite={props.isWhite} />;

  else if (!props.isLoading)
    return <PlayButton playSong={props.playSong} isWhite={props.isWhite} />;

  else
    return <LoadingButton isWhite={props.isWhite} />;
};
