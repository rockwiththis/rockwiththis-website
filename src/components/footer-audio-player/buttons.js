import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';

import { songPlayerShape } from 'constants/prop-shapes';

import SongPlayerControl from 'components/song-player-control/outline';

export default class FooterPlayerButtons extends Component {

  static propTypes = {
    playNextSong: PropTypes.func.isRequired,
    playPreviousSong: PropTypes.func,
    songPlayer: PropTypes.exact(songPlayerShape).isRequired
  }

  render = () => (
      <div className="footer-player-buttons">
        <div
          className={
            'player-nav' +
            (!this.props.playPreviousSong ? ' disabled' : '')
          }
          onClick={this.props.playPreviousSong}
        >
          <FaStepBackward />
        </div>

        <SongPlayerControl
          songPlayer={this.props.songPlayer}
          isWhite={true}
        />

        <div className="player-nav" onClick={this.props.playNextSong}>
          <FaStepForward />
        </div>

        <style jsx>{`
          .footer-player-buttons {
            padding-top: 10px;
            text-align: center;
          }
          .player-nav {
            display: inline-block;
            vertical-align: top;
            padding-top: 13px;
          }
        `}</style>
        <style jsx global>{`
          .footer-player-buttons .song-player-control {
            display: inline-block;
            width: 40px;
            height: 40px;
            margin: 0 20px;
          }
        `}</style>
      </div>
  );
}
