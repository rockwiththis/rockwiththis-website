import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Slider from 'rc-slider';

export default class FooterPlayerNavBar extends Component {

  static propTypes = {
    activeSongProgress: PropTypes.exact({
      playedSeconds: PropTypes.number.isRequired,
      playedRatio: PropTypes.number.isRequired,
    }),
    activeSongDuration: PropTypes.number,
    updateSongProgress: PropTypes.func.isRequired
  }

  secondsToTimeString = (seconds = 0) => {
    const numMinutes = Math.floor(seconds / 60)
    const numSeconds = Math.floor(seconds % 60)
      .toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

    return `${numMinutes}:${numSeconds}`
  }

  render = () => (
      <div className="footer-player-nav-bar">
        <div className="player-duration current-time">
          { this.secondsToTimeString(get(this.props.activeSongProgress, 'playedSeconds')) }
        </div>

        <div className="slider-container">
          <Slider
            min={0}
            max={1}
            step={0.001}
            value={get(this.props.activeSongProgress, 'playedRatio', 0)}
            onChange={this.props.updateSongProgress}
            railStyle={{ backgroundColor: '#3f3f3f', height: '5px' }}
            trackStyle={{ backgroundColor: '#0097d5', height: '5px' }}
          />
        </div>

        <div className="player-duration song-duration">
          { this.secondsToTimeString(get(this.props.activeSongDuration)) }
        </div>

        <style jsx>{`
          .player-duration {
            display: inline-block;
            vertical-align: top;
            width: 60px;
            font-size: 10px;
            letter-spacing: 2px;
            text-align: center;
            padding-top: 2px;
          }
          .slider-container {
            display: inline-block;
            vertical-align: top;
            width: calc(100% - 120px);
            height: 5px;
            padding-top: 5px;
          }
        `}</style>
      </div>
  )
}
