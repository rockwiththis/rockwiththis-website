import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SongHeader from './song-header';

export default class SongPost extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
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
        <div className="song-post-content">
          { this.separateParagraphs(this.props.songData.description).map(text => (
              <p>{ text }</p>
          ))}
        </div>

        <style jsx>{`
          .song-image {
            float: left;
            box-sizing: border-box;
            padding-right: 20px;
            padding-bottom: 20px;
          }
          .song-post-content {
            font-weight: 100;
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
