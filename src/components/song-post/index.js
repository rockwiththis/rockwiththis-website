import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SongHeader from './header';
import SongPostContent from './content';

export default class SongPost extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired
  }

  separateParagraphs = text => text.split(/\n+/g);

  render = () => (
      <div className="song-post">

        <img className="song-image" src={this.props.songData.image_url} />
        <SongHeader
          songData={this.props.songData}
          songPlayStatus={this.props.songPlayStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />
        <SongPostContent songData={this.props.songData} />

        <style jsx>{`
          .song-image {
            float: left;
          }
        `}</style>
        <style global jsx>{`
          .song-header {
            width: 100%;
          }
        `}</style>
      </div>
  )
}
