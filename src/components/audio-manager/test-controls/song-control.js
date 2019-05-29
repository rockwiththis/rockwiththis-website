import React from 'react';
import PropTypes from 'prop-types';
import SONG_STATUSES, { SONG_LOADING, SONG_READY, SONG_PLAYING, SONG_PAUSED } from 'constants/song-status';
import SongWaitingControls from './song-waiting-controls';
import SongPlayingControls from './song-playing-controls';

import './stylesheets/song-control.scss';

const propTypes = {
  song: PropTypes.object.isRequired,
  songStatus: PropTypes.oneOf(SONG_STATUSES),
  durationSeconds: PropTypes.number,
  playedSeconds: PropTypes.number,
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired,
  nextSong: PropTypes.func.isRequired,
  prevSong: PropTypes.func.isRequired,
  endSong: PropTypes.func.isRequired,
  getPlayerType: PropTypes.func.isRequired,
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
    formatTime(this.props.durationSeconds)

  render() {
    const { song, songStatus } = this.props;

    const controls = this.props.songStatus === SONG_PLAYING ?
      <SongPlayingControls
        pauseSong={this.props.pauseSong}
        nextSong={this.props.nextSong}
        prevSong={this.props.prevSong}
        endSong={this.props.endSong}
      />
      :
      <SongWaitingControls
        playSong={this.props.playSong}
      />;

    return (
        <div className="song-control">
          <p className="title">{ `${song.artist_name} - ${song.name}` }</p>
          <div className="status">
            <span className="status">{ songStatus }</span>
            <span className="duration">{ this.getTimeString() }</span>
            <span className="player-type">{ this.props.getPlayerType() || '???' }</span>
          </div>
          <div className="controls">{ controls }</div>
        </div>
    )
  }
}

export default SongControl;
