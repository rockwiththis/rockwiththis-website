import React from 'react';
import PropTypes from 'prop-types';
import SONG_STATUSES, { SONG_LOADING, SONG_READY, SONG_PLAYING, SONG_PAUSED } from 'constants/song-status';

import './stylesheets/song-control.scss';

const propTypes = {
  song: PropTypes.object.isRequired,
  songStatus: PropTypes.oneOf(SONG_STATUSES),
  durationSeconds: PropTypes.number,
  playedSeconds: PropTypes.number,
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
}

const formatTime = seconds => {
  if (!seconds) return '-';
  const numMinutes = Math.floor(seconds / 60)
  const numSeconds = (Math.floor(seconds % 60)).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  return `${numMinutes}:${numSeconds}`
}

class SongControl extends React.Component {
   
  getTimeString = () =>
    formatTime(this.props.playedSeconds) +
    ' / ' +
    formatTime(this.props.playedSeconds)

  togglePlay = () => {
    if ([SONG_READY, SONG_PAUSED].includes(this.props.songStatus))
      this.props.playSong();
    else if (this.props.songStatus === SONG_PLAYING)
      this.props.pauseSong();
  }

  getPlayToggleButton = () =>
    this.props.songStatus === SONG_PLAYING ?
      this.getPauseButton() : this.getPlayButton();

  getPlayButton = () =>
    <input
      type='button'
      value='PLAY'
      disabled={this.props.songStatus === SONG_LOADING}
      onClick={this.props.playSong}
    />;

  getPauseButton = () =>
    <input
      type='button'
      value='PAUSE'
      onClick={this.props.pauseSong}
    />;

  render() {
    const { song, songStatus } = this.props;
    return (
        <div className="song-control">
          <p className="title">{ `${song.artist_name} - ${song.name}` }</p>
          <div className="status">
            <span className="status">{ songStatus }</span>
            <span className="duration">{ this.getTimeString() }</span>
          </div>
          <div className="controls">
            { this.getPlayToggleButton() }
          </div>
        </div>
    )
  }
}

export default SongControl;
