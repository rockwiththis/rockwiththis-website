import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SongHeader from 'components/song-shared/song-header';

import { playSong, pauseSong } from 'actions/player';
import parseSongDescription from 'util/parse-song-description';

export default class FullSong extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
  }

  render = () => (
      <div className="full-song">
        <img className="songImage" src={song.image_url} />
        <SongHeader
          songData={this.props.songData}
          songPlayStatus={this.props.songPlayStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />
        <p
          className="song-post-content"
          dangerouslySetInnerHTML={parseSongDescription(song)}
        />
      </div>
  )
}
