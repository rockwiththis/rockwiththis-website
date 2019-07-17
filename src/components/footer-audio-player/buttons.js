import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaStepBackward, FaStepForward } from 'react-icons/fa';

import SongControlButton from 'components/buttons/single-song-controls/outline';

export default class FooterPlayerButtons extends Component {

  static propTypes = {
    activeSongPlayStatus: PropTypes.string,
    activeSongPlayerFunctions: PropTypes.object,
    playNextSong: PropTypes.func.isRequired,
    playPreviousSong: PropTypes.func
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

        <SongControlButton
          isWhite={true}
          songPlayerStatus={this.props.activeSongPlayStatus}
          songPlayerFunctions={this.props.activeSongPlayerFunctions}
        />

        <div className="player-nav">
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
          .footer-player-buttons .outline-single-song-controls {
            display: inline-block;
            width: 40px;
            height: 40px;
            margin: 0 20px;
          }
          .footer-player-buttons .outline-single-song-controls svg {
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
  );
}
