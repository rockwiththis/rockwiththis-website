import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import AnimateHeight from 'react-animate-height'
import { Icon } from 'react-fa'
import YouTube from 'react-youtube'

import { playSong, pauseSong } from 'actions';

import playButton from 'images/playbutton.svg'
import pauseButton from 'images/pauseButton.png'
import loadingButton from 'images/play-loading.gif'

const propTypes = {
  song: PropTypes.object.isRequired,

  // Redux
  isPlaying: PropTypes.bool.isRequired,
  activeSong: PropTypes.object.isRequired,
  songPlayerDurations: PropTypes.objectOf(PropTypes.number),
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
};

class HeroSong extends Component {

    // TODO this is duplicated in src/components/Song/Song.js
    onPressPlay = song => event => {
      // TODO this should be determined by caller
      // to guarantee that appearance of button aligns w/ its behavior
      const isPlayButton = (
          !this.props.isPlaying ||
          song.id !== this.props.activeSong.id
      );
      if (isPlayButton) this.props.playSong(song);
      else this.props.pauseSong();
    }

    render() {
        const {
            song,
            activeSong,
            isPlaying,
        } = this.props

        const readyToPlay = !!this.props.songPlayerDurations[song.id];
        const playPauseButton = !readyToPlay ?
          <img src={loadingButton} className="loadingButton" /> :
          song.id === activeSong.id && isPlaying ?
            <img src={pauseButton} className="pauseButton" /> :
            <img src={playButton} className="playButton" />

          return (
              <div className='post-square-wrapper play'>
                  <button
                      className="heroSongPlayerButton"
                      onClick={readyToPlay && this.onPressPlay(song)}
                  >
                      {playPauseButton}
                  </button>
              </div>
          )
    }
}

HeroSong.propTypes = propTypes;

export default connect(
    ({ isPlaying, activeSong, songPlayerDurations }) => ({
      isPlaying,
      activeSong,
      songPlayerDurations
    }),
    { playSong, pauseSong }
)(HeroSong)
