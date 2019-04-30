import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { SONG_LOADING, SONG_READY, SONG_PLAYING, SONG_PAUSED } from 'constants/song-status';
import AudioManager from 'components/audio-manager';
import SongControl from './song-control';

import './stylesheets/index.scss';

const propTypes = {
  songs: PropTypes.array.isRequired,
  loadMoreSongs: PropTypes.func.isRequired
}

class TestControls extends React.Component {

  constructor(props) {
    super(props);
    this.audioManagerRef = React.createRef();

    this.state = {
      isPaused: false,
      activeSong: null,
      readySongDurations: {},
      activeSongProgress: null
    }
  }

  componentDidMount = () =>
    this.audioManagerRef.current.setActiveSongs(this.props.songs);

  getSongStatus = song => {
    if (!!this.state.activeSong && this.state.activeSong.id === song.id)
      return this.state.isPaused ? SONG_PAUSED : SONG_PLAYING;
    else if (!!this.state.readySongDurations[song.id])
      return SONG_READY;
    else
      return SONG_LOADING;
  }

  playSong = song =>
    this.getSongStatus(song) === SONG_PAUSED ?
      this.playPausedSong() :
      this.playNewSong(song);


  playPausedSong = () => {
    this.audioManagerRef.current.playActiveSong();
    this.setState({ isPaused: false });
  }

  playNewSong = song => {
    this.audioManagerRef.current.playSongListSong(song);
    this.setState({
      activeSong: song,
      isPaused: false,
      activeSongProgress: 0
    });
  }

  pauseSong = () => {
    this.audioManagerRef.current.pauseActiveSong();
    this.setState({ isPaused: true });
  }

  playerLoaded = (songId, duration) => {
    console.log("player loaded", duration)
    this.setState({
      readySongDurations: {
        ...this.state.readySongDurations,
        [songId]: duration
      }
    });
  }

  getSongProgress = song =>
    [SONG_PLAYING, SONG_PAUSED].includes(this.getSongStatus(song)) &&
    this.state.activeSongProgress;

  setSongProgress = ({ playedSeconds }) =>
    this.setState({ activeSongProgress: playedSeconds });

  currentSongIndex = () =>
    this.props.songs.findIndex(song => song.id === this.state.activeSong.id)

  playNextSong = () => {
    const nextIndex = this.currentSongIndex() + 1;

    if (nextIndex >= this.props.songs.length) {
      this.props.loadMoreSongs()
        .then(newSongs => this.playSong(newSongs[0]));

    } else {
      this.playSong(this.props.songs[nextIndex]);
    }
  }

  playPreviousSong = () => {
    const prevIndex = this.currentSongIndex() - 1;
    if (prevIndex >= 0) this.playSong(this.props.songs[prevIndex]);
  }

  endActiveSong = () =>
    this.audioManagerRef.current.updateSongProgress(0.99);

  getPlayerTypeForSong = song =>
    this.audioManagerRef.current &&
    get(this.audioManagerRef.current.getPlayer(song), 'type')

  render() {
    return (
        <div className="audio-test-controls">
          { this.props.songs.map(song => (
              <SongControl
                key={song.id}
                song={song}
                songStatus={this.getSongStatus(song)}
                durationSeconds={this.state.readySongDurations[song.id]}
                playedSeconds={this.getSongProgress(song)}
                playSong={() => this.playSong(song)}
                pauseSong={() => this.pauseSong(song)}
                nextSong={() => this.playNextSong()}
                prevSong={() => this.playPreviousSong()}
                endSong={() => this.endActiveSong()}
                getPlayerType={() => this.getPlayerTypeForSong(song)}
              />
          ))}
          <AudioManager
            setSongDuration={this.playerLoaded}
            setActiveSongProgress={this.setSongProgress}
            playSong={this.playSong}
            onSongEnd={this.playNextSong}
            ref={this.audioManagerRef}
          />
        </div>
    )
  }
}

export default TestControls;
