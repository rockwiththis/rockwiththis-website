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
      </div>
  );
}
