import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SongGrid extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    isSpotlight: PropTypes.bool,
    setSongAsSpotlight: PropTypes.func.isRequired
  }

  render = () => (
      <div
        className={
          'song-grid' +
          (this.props.isSpotlight ? ' spotlight' : '')
        }
        onClick={this.props.setSongAsSpotlight()}
      >
        <div className="image-container">
          <img
            className="song-image"
            src={this.props.songData.image_url}
          />
          <div className="hover-content">
            <GenreTags song={this.props.songData} />
            <span className="readMore">Read More</span>
          </div>
        </div>

        <div className="song-info">
          <span className="song-name">{this.props.songData.name}</span>
          <span className="artist-name">{this.props.songData.artist_name}</span>
        </div>

      </div>
  )
}
