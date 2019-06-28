import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SongHeader from 'components/song-shared/song-header';

export default class FullSong extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
  }

  separateParagraphs = text => text.split(/\n+/g);

  render = () => (
      <div className="full-song">
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
            width: 40%;
            padding-right: 20px;
            padding-bottom: 20px;
          }
          .song-post-content {
            font-weight: 100;
            font-size: 12pt;
            line-height: 24pt;
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
