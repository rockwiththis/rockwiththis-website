import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { playSong, pauseSong } from 'actions/player';

import BadgeSingleSongControls from 'components/buttons/single-song-controls/badge';

class HeroSong extends Component {

  static propTypes = {
    song: PropTypes.object.isRequired,

    // Redux
    isPlaying: PropTypes.bool.isRequired,
    activeSong: PropTypes.object.isRequired,
    nextSong: PropTypes.object,
    songPlayerDurations: PropTypes.objectOf(PropTypes.number),
    playSong: PropTypes.func.isRequired,
    pauseSong: PropTypes.func.isRequired
  }

  isSongActive = () =>
    this.props.song.id === this.props.activeSong.id

  render = () => (
    <div className='post-square-wrapper play'>
      <BadgeSingleSongControls
        isPlaying={this.props.isPlaying}
        isActiveSong={this.isSongActive()}
        isLoading={!this.props.songPlayerDurations[this.props.song.id]}
        pauseSong={() => this.props.pauseSong(this.props.song)}
        playSong={() => this.props.playSong(this.props.song)}
      />
    </div>
  )
}

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
