import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class FooterPlayerSongInfo extends Component {

  static propTypes = {
    activeSong: PropTypes.object.isRequired
  }

  render = () => (
      !!this.props.activeSong.id ?
      (
        <div className="footer-player-song-info">

          <Link
            href={`/songs/[id]?id=${this.props.activeSong.id}`}
            as={`/songs/${this.props.activeSong.id}`}
          >
            <img className="song-image" src={this.props.activeSong.image_url} alt="" />
          </Link>

          <div className="song-title">
            <Link
              href={`/songs/[id]?id=${this.props.activeSong.id}`}
              as={`/songs/${this.props.activeSong.id}`}
            >
              <div className="song-name">{this.props.activeSong.name}</div>
            </Link>

            <div className="artist-name">{this.props.activeSong.artist_name}</div>
          </div>
        
          <style jsx>{`
            .footer-player-song-info {
              padding: 10px;
              box-sizing: border-box;
            }
            .song-image {
              width: 55px;
              height: 55px;
            }
            .song-title {
              display: inline-block;
              vertical-align: top;
              padding-top: 10px;
              padding-left: 10px;
              font-size: 16px;
              line-height: 20px;
            }
            .song-name {
              font-weight: bold;
            }
          `}</style>
        </div>
      )
      :
      <div className="footer-player-song-info"></div>
  );
}
