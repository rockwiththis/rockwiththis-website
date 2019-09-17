import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { songPlayerDataShape } from 'constants/prop-shapes';
import getSongPlayer from 'util/get-song-player';
import { playSong, pauseSong, loadSong, loadNextSong } from 'actions/player';

import SongInfo from './song-info';
import Buttons from './buttons';
import NavBar from './nav-bar';
import SourceIcon from './source-icon';

class FooterAudioPlayer extends Component {

  static propTypes = {
    updateSongProgress: PropTypes.func.isRequired,

    // from redux
    activeSongData: PropTypes.object.isRequired,
    playerData: PropTypes.exact(songPlayerDataShape).isRequired,
    filteredSongData: PropTypes.array.isRequired,
    activeSongProgress: PropTypes.exact({
      playedRatio: PropTypes.number.isRequired,
      playedSeconds: PropTypes.number.isRequired,
    }).isRequired,
    loadNextSong: PropTypes.func.isRequired,
    loadSong: PropTypes.func.isRequired
  }

  previousSongLoader = () => {
    const previousSong = this.findPreviousSong();
    return previousSong && (() => this.props.loadSong(previousSong));
  }

  findPreviousSong = () => {
    const prevIndex = this.props.filteredSongData.findIndex(song => song.id === this.props.activeSongData.id) - 1;
    if (prevIndex < 0) return null;

    return this.props.filteredSongData[prevIndex];
  }

  render = () => (
      <footer>
        <SongInfo activeSong={this.props.activeSongData} />

        <div className="song-controls">
          <Buttons
            loadNextSong={this.props.loadNextSong}
            loadPreviousSong={this.previousSongLoader()}
            songPlayer={getSongPlayer(this.props.activeSongData, this.props.playerData)}
          />
          <NavBar
            activeSongProgress={this.props.activeSongProgress}
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
          @media (max-width: 1200px) {
            .song-controls {
              margin-top: 5px;
            }
          }
          @media (max-width: 800px) {
            .song-controls {
              width: 200px;
              float: right;
              margin-right: 70px;
            }
          }
          @media (max-width: 600px) {
            .song-controls {
              float: left;
              width: 50px;
            }
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
          @media (max-width: 1200px) {
            footer .footer-player-nav-bar {
              display: none;
            }
          }
          @media (max-width: 600px) {
            footer .song-image {
              display: none;
            }
            footer .song-title {
              margin-left: 50px;
            }
            footer .player-nav {
              display: none !important;
            }
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

const actions = { playSong, pauseSong, loadSong, loadNextSong };

const buildProps = (
  { activeSongData, filteredSongData, activeSongProgress, player },
  { playSong, pauseSong, loadSong, loadNextSong },
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
  },
  loadSong,
  loadNextSong
})

export default connect(
  stateToProps,
  actions,
  buildProps
)(FooterAudioPlayer);
