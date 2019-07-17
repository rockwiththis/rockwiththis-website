import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SongInfo from './song-info';
import Buttons from './buttons';
import NavBar from './nav-bar';
import SourceIcon from './source-icon';

export default class FooterAudioPlayer extends Component {

  static propTypes = {
    activeSong: PropTypes.object,
    activeSongPlayStatus: PropTypes.string,
    activeSongPlayerFunctions: PropTypes.object,
    updateSongProgress: PropTypes.func.isRequired,
    playNextSong: PropTypes.func.isRequired,
    playPreviousSong: PropTypes.func,
    activeSongTime: PropTypes.exact({
      playedSeconds: PropTypes.number.isRequired,
      playedRatio: PropTypes.number.isRequired,
      durationSeconds: PropTypes.number.isRequired
    })
  }

  render = () => (
      <footer>
        <SongInfo activeSong={this.props.activeSong} />
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
        { !!this.props.activeSong &&
            <SourceIcon activeSong={this.props.activeSong} />
        }
      </footer>
  );
}
