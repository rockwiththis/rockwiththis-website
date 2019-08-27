import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaSpotify } from 'react-icons/fa';

export default class HeaderTitle extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired
  }

  render = () => (
      <div className="header-title">

        <div className="song-name-wrapper">
          <Link href={`/songs/[id]?id=${this.props.songData.id}`} as={`/songs/${this.props.songData.id}`}>
            <span className="song-name">{this.props.songData.name}</span>
          </Link>
          <a className="spotify-link" href={this.props.songData.spotify_link}>
            <FaSpotify />
          </a>
        </div>

        <div className="song-artist">{this.props.songData.artist_name}</div>

        <style jsx>{`
          .song-name-wrapper {
            cursor: pointer;
            margin-bottom: -5px;
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .song-name {
            font-weight: 700;
          }
          .spotify-link {
            color: #65d36e;
            vertical-align: middle;
            padding-left: 10px;
          }
          .song-artist {
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        `}</style>
      </div>
  )
}
