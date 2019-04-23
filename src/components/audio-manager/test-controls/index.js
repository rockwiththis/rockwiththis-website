import React from 'react';
import PropTypes from 'prop-types';
import { SONG_LOADING, SONG_READY, SONG_PLAYING, SONG_PAUSED } from 'constants/song-status';
import AudioManager from 'components/audio-manager';
import SongControl from './song-control';

const propTypes = {
  songs: PropTypes.array.isRequired,
  loadMoreSongs: PropTypes.func.isRequired
}

class TestControls extends React.Component {

  constructor(props) {
    super(props);
    this.playerBankRef = React.createRef();

    this.state = {
      isPaused: false,
      activeSong: null,
      readySongDurations: {},
      activeSongProgress: null
    }
  }

  getSongStatus = song => {
    if (this.state.activeSong.id === song.id)
      return this.state.isPaused ? SONG_PAUSED : SONG_PLAYING;
    else if (!!this.readySongDurations[song.id])
      return SONG_READY;
    else
      return SONG_LOADING;
  }

  playSong = song => {
    this.playerBankRef.current.playSongListSong(song);
    this.setState({
      activeSong: song,
      isPaused: false,
      activeSongProgress: 0
    });
  }

  pauseSong = () => {
    this.playerBankRef.current.pauseActiveSong();
    this.setState({ isPaused: true });
  }

  playerLoaded = (songId, duration) =>
    this.setState({
      readySongDurations: {
        ...this.state.readySongDurations,
        [songId]: duration
      }
    });

  getSongProgress = song =>
    [SONG_PLAYING, SONG_PAUSED].includes(this.getSongStatus(song)) &&
    this.state.activeSongProgress;

  setSongProgress = ({ playedSeconds }) =>
    this.setState({ activeSongProgress: playedSeconds });

  playNextSong = () => {
    const nextIndex = this.props.songs.findIndex(song => song.id === this.state.activeSong.id) + 1;

    if (nextIndex >= this.props.songs.length) {
      this.props.loadMoreSongs()
        .then(newSongs => this.playSong(newSongs[0]));

    } else {
      this.playSong(this.props.songs[nextIndex]);
    }
  }

  render() {
    return (
        <div className="audio-test-controls">
          { !!this.playerBankRef.current && this.props.songs.map(song => (
              <SongControl
                song={song}
                songStatus={this.getSongStatus(song)}
                durationSeconds={this.state.readySongDurations[song.id]}
                playedSeconds={this.getSongProgress(song)}
                playSong={() => this.playSong(song)}
                pauseSong={() => this.pauseSong(song)}
              />
          ))}
          <AudioManager
            setSongDuration={this.playerLoaded}
            setActiveSongProgress={this.setSongProgress}
            playSong={this.playSong}
            onSongEnd={this.playNextSong}
            ref={this.playerBankRef}
          />
        </div>
    )
  }
}

export default TestControls;
