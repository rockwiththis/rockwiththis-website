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
        <div className="dummy">{/* This lets us size the height the same as the width */}</div>
        <div className="image-container">
          <img
            className="song-image"
            src={this.props.songData.image_url}
          />
          <div className="hover-overlay"></div>
          <div className="hover-content">
            <GenreTags song={this.props.songData} />
            <span className="read-more">Read More</span>
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
            vertical-align: top;
            width: 25%;
            cursor: pointer;
          }
          .dummy {
            margin-top: 100%;
          }
          .image-container {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
          }
          .song-image {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
          }
          .hover-overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            background-color: black;
            opacity: 0
          }
          .song-grid-song:hover .hover-overlay {
            opacity: 0.5;
          }
          .hover-content {
            position: absolute;
            top: 40%;
            transform: translateY(-50%);
            -webkit-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            text-align: center;
            width: 100%;
            color: white;
            line-height: 10pt;
            font-size: 10pt;
            opacity: 0;
          }
          .read-more {
            font-size: 10px;
            padding: 8px;
            background: #1a6ea9;
            border-radius: 4px;
          }
          .song-grid-song:hover .hover-content {
            opacity: 1;
          }
          .song-info {
            position: absolute;
            bottom: 0;
            width 100%;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px;
            box-sizing: border-box;
          }
          .song-grid-song:hover .song-info {
            background: rgba(0, 0, 0, 0.7);
            color: white;
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
          @media (max-width: 1100px) {
            .song-grid-song {
              width: 50%;
            }
          }
        `}</style>
        <style global jsx>{`
          .song-grid-song .genre-tags {
            display: block;
            padding-bottom: 15px;
          }
          .song-grid-song .genre-tag {
            display: block;
            width: 100%;
          }
        `}</style>
      </div>
  )
}
