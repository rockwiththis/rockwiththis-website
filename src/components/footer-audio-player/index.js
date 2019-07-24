import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { songPlayerDataShape } from 'constants/prop-shapes';
import getSongPlayer from 'util/get-song-player';
import { playSong, pauseSong } from 'actions/player';

import SongInfo from './song-info';
import Buttons from './buttons';
import NavBar from './nav-bar';
import SourceIcon from './source-icon';

class FooterAudioPlayer extends Component {

  static propTypes = {
    playNextSong: PropTypes.func.isRequired,
    updateSongProgress: PropTypes.func.isRequired,

    // from redux
    activeSongData: PropTypes.object.isRequired,
    playerData: PropTypes.exact(songPlayerDataShape).isRequired,
    filteredSongData: PropTypes.array.isRequired,
    activeSongProgress: PropTypes.exact({
      playedRatio: PropTypes.number.isRequired,
      secondsPlayed: PropTypes.number.isRequired,
    }).isRequired
  }

  playPreviousSong = () =>
    this.props.playerData.playSong(this.findPreviousSong())

  findPreviousSong = () => {
    const prevIndex = this.props.filteredPosts.findIndex(song => song.id === this.props.activeSongData.id) - 1;
    if (prevIndex < 0) return null;

    return this.props.filteredPosts[prevIndex];
  }

  render = () => (
      <footer>
        <SongInfo activeSong={this.props.activeSongData} />

        <div className="song-controls">
          <Buttons
            playNextSong={this.props.playNextSong}
            playPreviousSong={this.playPreviousSong}
            songPlayer={getSongPlayer(this.props.activeSongData, this.props.playerData)}
          />
          <NavBar
            activeSongProgress={this.props.activeSongTime}
            activeSongDuration={this.props.playerData.songPlayerDurations[this.props.activeSongData.id]}
            updateSongProgress={this.props.updateSongProgress}
          />
        </div>

        { !!this.props.activeSongData &&
            <SourceIcon activeSong={this.props.activeSongData} />
        }

        <style jsx>{`
          footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 75px;
            border-top: 2px solid white;
            z-index: 100;
            background-color: #282828;
            color: white;
          }
          .song-controls {
            width: 550px;
            margin: 0 auto;
          }
        `}</style>
        <style jsx global>{`
          footer .footer-player-song-info {
            position: absolute;
            left: 0;
            display: inline-block;
          }
          footer .footer-player-buttons {
            width: 100%;
          }
          footer .footer-player-source-icon {
            position: absolute;
            right: 0;
            top: 0;
            display: inline-block;
          }
        `}</style>
      </footer>
  );
}

const stateToProps = ({
  isPlaying,
  songPlayerDurations,
  activeSong,
  filteredPosts,
  activeSongProgress
}) => ({
  activeSongData: activeSong,
  filteredSongData: filteredPosts,
  activeSongProgress,
  player: {
    activeSong,
    isPlaying,
    songPlayerDurations,
  }
});

const actions = { playSong, pauseSong };

const buildProps = (
  { activeSongData, filteredSongData, activeSongProgress, player },
  { playSong, pauseSong },
  ownProps
) => ({
  ...ownProps,
  activeSongData,
  filteredSongData,
  activeSongProgress,
  playerData: {
    ...player,
    playSong,
    pauseSong
  }
})

export default connect(
  stateToProps,
  actions,
  buildProps
)(FooterAudioPlayer);
