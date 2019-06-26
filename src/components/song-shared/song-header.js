import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';

import GenreTags from './genre-tags';
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

  render = () => (
      <div className="song-header">

        <OutlineSingleSongControls
          songPlayerStatus={this.props.songPlayerStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />

        <div className="song-title-wrapper">
          <Link className="song-title" href={`/songs/${this.props.songData.id}`}>
            {this.props.songData.name}
          </Link>
          <a className="spotify-link" href={this.props.songData.spotify_link}>
            <i className="fa fa-spotify" aria-hidden="true" />
          </a>
        </div>

        <div className="song-artist">
          {this.props.songData.artist_name}
        </div>

        <div className="meta-info">
          <span className="curated-by">Curated by </span>
          <span className="curator-name">{this.getSongCuratorFullName()}</span>
          <span className="separator">|</span>
          <GenreTags song={this.props.songData} />
          <ShareBox song={this.props.songData} />
        </div>
          
      </div>
  );
};
