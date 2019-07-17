import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SongInfo from './song-info';
import Buttons from './buttons';
import NavBar from './nav-bar';
import SourceIcon from './source-icon';

class FooterAudioPlayer extends Component {

  static propTypes = {
    activeSongPlayStatus: PropTypes.string,
    activeSongPlayerFunctions: PropTypes.object,
    updateSongProgress: PropTypes.func.isRequired,
    playNextSong: PropTypes.func.isRequired,
    playPreviousSong: PropTypes.func,
    activeSongTime: PropTypes.exact({
      playedSeconds: PropTypes.number.isRequired,
      playedRatio: PropTypes.number.isRequired,
      durationSeconds: PropTypes.number.isRequired
    }),

    // from redux
    activeSong: PropTypes.object.isRequired
  }

  render = () => (
      <footer>
        <SongInfo activeSong={this.props.activeSong} />

        <div className="song-controls">
          <Buttons
            activeSongPlayStatus={this.props.activeSongPlayStatus}
            activeSongPlayerFunctions={this.props.activeSongPlayerFunctions}
            playNextSong={this.props.playNextSong}
            playPreviousSong={this.props.playPreviousSong}
          />
          <NavBar
            activeSongTime={this.props.activeSongTime}
            updateSongProgress={this.props.updateSongProgress}
          />
        </div>

        { !!this.props.activeSong &&
            <SourceIcon activeSong={this.props.activeSong} />
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

export default connect(
  ({ activeSong }) => ({ activeSong })
)(FooterAudioPlayer);
