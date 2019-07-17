import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Slider from 'rc-slider';

export default class FooterPlayerNavBar extends Component {

  static propTypes = {
    activeSongTime: PropTypes.exact({
      playedSeconds: PropTypes.number.isRequired,
      playedRatio: PropTypes.number.isRequired,
      durationSeconds: PropTypes.number.isRequired
    }),
    updateSongProgress: PropTypes.func
  }

  secondsToTimeString = (seconds = 0) => {
    const numMinutes = Math.floor(seconds / 60)
    const numSeconds = Math.floor(seconds % 60)
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

    return `${numMinutes}:${numSeconds}`
  }

  render = () => (
      <div className="footer-player-nav-bar">
        <div className="player-duration-bar-current-time">
          { this.secondsToTimeString(get(this.props.activeSongTime, 'playedSeconds')) }
        </div>

        <div className="player-duration-bar">
          <Slider
            min={0}
            max={1}
            step={0.001}
            value={get(this.props.activeSongTime, 'playedRatio', 0)}
            onChange={this.props.updateSongProgress}
          />
        </div>

        <div className="player-duration-bar-song-duration">
          { this.secondsToTimeString(get(this.props.activeSongTime, 'durationSeconds')) }
        </div>
      </div>
  )
}
