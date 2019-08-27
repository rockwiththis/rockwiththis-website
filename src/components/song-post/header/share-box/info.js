import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { IoIosClose as CloseIcon } from 'react-icons/io';

export default class ShareBoxInfo extends Component {

  static propTypes = {
    song: PropTypes.object.isRequired,
    closePopup: PropTypes.func.isRequired
  }

  render = () => (
    <div className="share-box-info">
      <img src={this.props.song.image_url} />
      <div className="close" onClick={this.props.closePopup}>
        <CloseIcon />
      </div>

      <div className="song-info">
        <p className="share-title">Share this post!</p>
        <p className="song-name">{this.props.song.name}</p>
        <p className="artist-name">{this.props.song.artist_name}</p>
      </div>

      <style jsx>{`
        img {
          width: 120px;
          height: 120px;
          display: inline-block;
        }
        .close {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 20px;
          cursor: pointer;
        }
        .song-info {
          display: inline-block;
          vertical-align: top;
          width: calc(100% - 120px);
          padding-left: 20px;
          box-sizing: border-box;
        }
        .song-info p {
          margin: 0;
        }
        .song-info p.share-title {
          font-style: italic;
          font-size: 20px;
          border-bottom: 1px solid;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .song-name {
          font-size: 25px;
          font-weight: 700;
        }
        .artist-name {
          font-size: 25px;
          color: #545151;
        }
      `}</style>
    </div>
  )
}
