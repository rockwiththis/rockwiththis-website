import React from 'react';
import PropTypes from 'prop-types';
import SONG_STATUSES, { SONG_LOADING, SONG_READY, SONG_PLAYING, SONG_PAUSED } from 'constants/song-status';

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

  getControlButton = () =>
    this.props.songStatus === SONG_PLAYING ?
      this.getPauseButton() : this.getPlayButton();

  getPlayButton = () =>
    <button
      disabled={this.props.songStatus === SONG_LOADING}
      onClick={this.props.playSong}
    >
      PLAY
    </button>;

  getPauseButton = () =>
    <button onClick={this.props.pauseSong}>PAUSE</button>;

  render() {
    const { song, songStatus } = this.props;
    return (
        <div className="song-control">
          <p className="title">{ `${song.artist_name} - ${song.name}` }</p>
          <p className="duration">{ this.getTimeString() }</p>
          { this.getControlButton() }<span className="status">{ songStatus }</span>
        </div>
    )
  }
}

export default SongControl;
