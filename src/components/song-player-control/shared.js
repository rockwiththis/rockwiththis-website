import React from 'react';
import PropTypes from 'prop-types';

import { songPlayerShape } from 'constants/prop-shapes';
import { SONG_PLAYING, SONG_PAUSED, SONG_READY } from 'constants/song-player-statuses';

export const propTypes = {
  songPlayer: PropTypes.exact(songPlayerShape).isRequired,
  isWhite: PropTypes.bool
}

export const getVisibleButton = (props, PauseButton, LoadingButton, PlayButton) => {
  if (props.songPlayer.status === SONG_PLAYING)
    return <PauseButton pauseSong={props.songPlayer.pause} isWhite={props.isWhite} />;

  else if ([SONG_PAUSED, SONG_READY].includes(props.songPlayer.status))
    return <PlayButton playSong={props.songPlayer.play} isWhite={props.isWhite} />;

  else
    return <LoadingButton isWhite={props.isWhite} />;
};
