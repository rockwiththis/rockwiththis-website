import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { songPlayerShape } from 'constants/prop-shapes';

import SongImage from './song-image';
import SongDetails from './song-details';

export default class SongTile extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayer: PropTypes.exact(songPlayerShape).isRequired,
    isFeaturedSong: PropTypes.bool
  }

  render = () => (
      <div
        className={
          'song-tile' +
          (this.props.isFeaturedSong ? ' featured-song' : '')
        }
      >
        <div className="dummy">{/* This lets us size the height the same as the width */}</div>
        <SongImage songData={this.props.songData} />

        {this.props.isFeaturedSong &&
          <span className="featured-song-tag">Song of the day</span>
        }
        <SongDetails
          songData={this.props.songData}
          songPlayer={this.props.songPlayer}
        />

        <style jsx>{`
          .song-tile {
            // TODO it would be super nice to declare these styles as "overridable"
            // to avoid !importants @ newest-songs/index.js
            display: inline-block;
            vertical-align: top;
            position: relative;
            cursor: pointer;
          }
          .dummy {
            margin-top: 100%;
          }
          .featured-song-tag {
            position: absolute;
            bottom: 65px;
            font-size: 10pt;
            padding: 12px;
            background-color: #ec2121;
            color: white;
            text-transform: uppercase;
            letter-spacing: 5px;
            font-weight: bold;
            z-index: 2;
          }
        `}</style>
        <style jsx global>{`
          .song-tile:hover .hover-content {
            opacity: 1;
          }
          .song-tile.featured-song .song-details {
            height: 65px;
          }
          .song-tile.featured-song .song-player-control {
            height: 55px;
            width: 55px;
          }
          .song-tile.featured-song .song-info {
            font-size: 24px;
            line-height: 26px;
            width: calc(100% - 52px - 65px);
          }
          .song-tile.featured-song .post-date {
            width: 60px;
            padding-top: 8px;
          }
          .song-tile.featured-song .post-date .month {
            font-size: 14px;
            line-height: 20px;
          }
          .song-tile.featured-song .post-date .day {
            font-size: 26px;
            font-weight: bold;
          }
        `}</style>
      </div>
  );
}
