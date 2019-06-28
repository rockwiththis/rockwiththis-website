import React, { Component } from 'react'
import PropTypes from 'prop-types'

import GenreTags from 'components/song-shared/genre-tags';

export default class SongGridSong extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    isSpotlight: PropTypes.bool,
    setSongAsSpotlight: PropTypes.func.isRequired
  }

  render = () => (
      <div
        className={
          'song-grid-song' +
          (this.props.isSpotlight ? ' spotlight' : '')
        }
        onClick={this.props.setSongAsSpotlight}
      >
        <div className="image-container">
          <img
            className="song-image"
            src={this.props.songData.image_url}
          />
          <div className="hover-content-overlay">
            <div className="hover-content">
              <GenreTags song={this.props.songData} />
              <span className="read-more">Read More</span>
            </div>
          </div>
        </div>

        <div className="song-info">
          <span className="song-name">{this.props.songData.name}</span>
          <span className="artist-name">{this.props.songData.artist_name}</span>
        </div>

        <style jsx>{`
          .song-grid-song {
            position: relative;
            display: inline-block;
            width: 25%;
            cursor: pointer;
          }
          .image-container {
            position: relative;
          }
          .song-image {
            width : 100%;
          }
          .hover-content-overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.5);
          }
          .hover-content {
            position: absolute;
            top: 45%;
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            text-align: center;
            width: 100%;
            color: white;
            font-size: 10pt;
          }
          .song-info {
            position: absolute;
            bottom: 0;
            width 100%;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px;
          }
          .song-info > span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 8pt;
            line-height: 9pt;
            display: block;
            width: calc(100% - 8px);
          }
          .song-name {
            font-weight: 700;
          }
          .artist-name {
            font-weight: 400;
          }
        `}</style>
        <style global jsx>{`
          .song-grid-song .genre-tags {
            margin-bottom: 10px;
          }
          .song-grid-song .genre-tag {
            display: block;
            width: 100%;
          }
        `}</style>
      </div>
  )
}
