import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import AnimateHeight from 'react-animate-height'
import { Icon } from 'react-fa'
import YouTube from 'react-youtube'

import { playSong, pauseSong } from 'actions/player';

import playButton from 'images/playbutton.svg'
import pauseButton from 'images/pauseButton.png'
import loadingButton from 'images/play-loading.gif'

const propTypes = {
  song: PropTypes.object.isRequired,

  // Redux
  isPlaying: PropTypes.bool.isRequired,
  activeSong: PropTypes.object.isRequired,
  nextSong: PropTypes.object,
  songPlayerDurations: PropTypes.objectOf(PropTypes.number),
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
};

class HeroSong extends Component {

    isPlaying = () =>
      this.props.isPlaying &&
      this.props.song.id === this.props.activeSong.id

    isLoading = () =>
      this.props.nextSong &&
      this.props.song.id === this.props.nextSong.id

    // TODO this is duplicated in src/components/Song/Song.js
    togglePlay = () => {
      if (this.isPlaying()) this.props.pauseSong();
      else this.props.playSong(this.props.song)
    }

    render() {
        const playPauseButton = this.isPlaying() ?
          <img src={pauseButton} className="pauseButton" /> :
          this.isLoading() ?
            <img src={loadingButton} className="loadingButton" /> :
            <img src={playButton} className="playButton" />

          return (
              <div className='post-square-wrapper play'>
                  <button
                      className="heroSongPlayerButton"
                      onClick={this.togglePlay}
                  >
                      {playPauseButton}
                  </button>
              </div>
          )
    }
}

HeroSong.propTypes = propTypes;

export default connect(
  ({
    isPlaying,
    activeSong,
    nextSong,
    songPlayerDurations
  }) => ({
    isPlaying,
    activeSong,
    nextSong,
    songPlayerDurations
  }),
  { playSong, pauseSong }
)(HeroSong)
