import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';

import GenreTags from './genre-tags';
import ShareBox from './share-box';

import OutlineSingleSongControls from 'components/buttons/single-song-controls/outline';

export default class SongHeader extends Component {

  getSongCuratorFullName = () =>
    `${this.props.song.curator_first_name} ${this.props.song.curator_last_name}`;

  render = () => (
      <div className="song-header">

        <OutlineSingleSongControls
          isPlaying={this.props.isPlaying}
          isActiveSong={this.props.song.id === this.props.activeSong.id}
          isLoading={!this.props.songPlayerDurations[song.id]}
          pauseSong={() => this.props.pauseSong(song)}
          playSong={() => this.props.playSong(song)}
        />

        <div className="song-title-wrapper">
          <Link className="song-title" href={`/songs/${this.props.song.id}`}>
            {this.props.song.name}
          </Link>
          <a className="spotify-link" href={this.props.song.spotify_link}>
            <i className="fa fa-spotify" aria-hidden="true" />
          </a>
        </div>

        <div className="song-artist">
          {this.props.song.artist_name}
        </div>

        <div className="meta-info">
          <span className="curated-by">Curated by </span>
          <span className="curator-name">{this.getSongCuratorFullName()}</span>
          <span className="separator">|</span>
          <GenreTags song={this.props.song} />
          <ShareBox song={this.props.song} />
        </div>
          
      </div>
  );
};
