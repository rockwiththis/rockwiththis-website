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
    playPreviousSong: PropTypes.func,
    activeSongTime: PropTypes.exact({
      playedSeconds: PropTypes.number.isRequired,
      playedRatio: PropTypes.number.isRequired,
      durationSeconds: PropTypes.number.isRequired,
      update: PropTypes.func.isRequired
    }).isRequired,

    // from redux
    activeSongData: PropTypes.object.isRequired,
    playerData: PropTypes.exact(songPlayerDataShape).isRequired
  }

  render = () => (
      <footer>
        <SongInfo activeSong={this.props.activeSongData} />

        <div className="song-controls">
          <Buttons
            playNextSong={this.props.playNextSong}
            playPreviousSong={this.props.playPreviousSong}
            songPlayer={getSongPlayer(this.props.activeSongData, this.props.playerData)}
          />
          <NavBar activeSongTime={this.props.activeSongTime} />
        </div>

        { !!this.props.activeSong &&
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
  activeSong
}) => ({
  activeSongData: activeSong,
  player: {
    activeSong,
    isPlaying,
    songPlayerDurations,
  }
});

const actions = { playSong, pauseSong };

const buildProps = (
  { activeSongData, player },
  { playSong, pauseSong },
  ownProps
) => ({
  ...ownProps,
  activeSongData,
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
