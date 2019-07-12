import React, { Component } from 'react';
import PropTypes from 'prop-types'

import SongImage from './song-image';
import SongDetails from './song-details';

export default class SongTile extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
    isFeaturedSong: PropTypes.bool
  }

  render = () => (
      <div
        className={
          'song-tile' +
          (this.props.isFeaturedSong ? ' featured-song' : '')
        }
      >
        <SongImage songData={this.props.songData} />

        {this.props.isFeaturedSong &&
          <span className="featured-song-tag">Song of the day</span>
        }
        <SongDetails
          songData={this.props.songData}
          songPlayerStatus={this.props.songPlayerStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
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
          .featured-song-tag {
            position: absolute;
            bottom: 42px;
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
      </div>
  );
}
