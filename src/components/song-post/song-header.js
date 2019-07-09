import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaSpotify } from 'react-icons/fa';

import GenreTags from 'components/song-shared/genre-tags';
import ShareBox from './share-box';

import OutlineSingleSongControls from 'components/buttons/single-song-controls/outline';

export default class SongHeader extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
  }

  getSongCuratorFullName = () =>
    `${this.props.songData.curator_first_name} ${this.props.songData.curator_last_name}`;

  render = () => {
    const songId = this.props.songData.id;

    return (
        <div className="song-header">

          <OutlineSingleSongControls
            songPlayerStatus={this.props.songPlayerStatus}
            songPlayerFunctions={this.props.songPlayerFunctions}
          />

          <div className="header-title">
            <div className="song-name-wrapper">
              <Link href={`/songs/[id]?id=${songId}`} as={`/songs/${songId}`}>
                <span className="song-name">{this.props.songData.name}</span>
              </Link>
              <a className="spotify-link" href={this.props.songData.spotify_link}>
                <FaSpotify />
              </a>
            </div>
            <div className="song-artist">
              {this.props.songData.artist_name}
            </div>
          </div>

          <div className="meta-info">
            <span className="curated-by">Curated by </span>
            <span className="curator-name">{this.getSongCuratorFullName()}</span>
            <span className="separator">|</span>
            <GenreTags song={this.props.songData} firstOnly={true} />
            <ShareBox song={this.props.songData} />
          </div>

          <style jsx>{`
            .header-title {
              display: inline-block;
              vertical-align: top;
              box-sizing: border-box;
              padding-left: 10px;
            }
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
            .meta-info {
              font-size: 14pt;
            }
            .curator-name {
              font-weight: bold;
            }
            .separator {
              margin: 0 10px;
            }
          `}</style>
          <style global jsx>{`
            .song-header .outline-single-song-controls {
              display: inline-block;
            }
            .song-header .outline-single-song-controls svg {
              width: 100%;
              height: 100%;
            }
            .song-header .genre-tag {
              padding: 6px 8px;
              border-radius: 4px;
              color: #fff;
              background: #1a6ea9;
              font-size: 11px;
              margin-right: 10px;
            }
          `}</style>
        </div>
    );
  }
};
