import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import AnimateHeight from 'react-animate-height'
import { Icon } from 'react-fa'
import YouTube from 'react-youtube'

import { toggleSong, togglePlayPause } from 'actions/queue'

import  playButton  from 'images/playbutton.svg'
import  pauseButton  from 'images/pauseButton.png'

class HeroSong extends Component {

    // TODO this is duplicated in src/components/Song/Song.js
    onPressPlay = song => event => {
        // TODO this should be determined by caller
        // to guarantee that appearance of button aligns w/ its behavior
        const isPlayButton = (
            !this.props.isPlaying ||
            song.id !== this.props.activeSong.id
        );
        this.props.actions.togglePlayPause(isPlayButton);
        if (isPlayButton) this.props.actions.toggleSong(song);
    }

    render() {
        const {
            song,
            activeSong,
            isPlaying,
        } = this.props

        const playPauseButton = song.id === activeSong.id && isPlaying ? (
            <img src={pauseButton} className="pauseButton" />
        ) : (
            <img src={playButton} className="playButton" />
        )

          return (
              <div className='post-square-wrapper play'>
                  <button
                      className="heroSongPlayerButton"
                      onClick={this.onPressPlay(song)}
                  >
                      {playPauseButton}
                  </button>
              </div>
          )
    }
}

HeroSong.propTypes = {
    song: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    activeSong: PropTypes.object,
}

HeroSong.defaultProps = {
    activeSong: {},
}

export default HeroSong
