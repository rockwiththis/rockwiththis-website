import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class FooterPlayerSongInfo extends Component {

  static propTypes = {
    activeSong: PropTypes.object
  }

  render = () => (
      !!this.props.activeSong ?
      (
        <div className="footer-player-song-info">

          <Link
            href={`/songs/[id]?id=${this.props.activeSong.id}`}
            as={`/songs/${this.props.activeSong.id}`}
          >
            <img className="song-image" src={activeSong.image_url} alt="" />
          </Link>

          <div className="song-title">
            <Link
              href={`/songs/[id]?id=${this.props.activeSong.id}`}
              as={`/songs/${this.props.activeSong.id}`}
            >
              <span className="song-name">{this.props.activeSong.name}</span>
            </Link>

            <span className="artist-name">{this.props.activeSong.artist_name}</span>
          </div>
        
        </div>
      )
      :
      <div className="footer-player-song-info"></div>
  );
}
