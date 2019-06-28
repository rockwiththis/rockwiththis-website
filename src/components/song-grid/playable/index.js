import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Link from 'next/link';

import SongImage from './song-image';
import SongPostDetails from './song-post-details';

export default class PlayableGridSong extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
    isFeaturedSong: PropTypes.bool
  }

  render = () => (
      <div
        className={
          'playable-grid-song' +
          (this.props.isFeaturedSong ? ' featured-song' : '')
        }
      >
        <SongImage songData={this.props.songData} />

        {this.props.isFeaturedSong &&
          <span className="featured-song-tag">Song of the day</span>
        }
        <SongPostDetails
          songData={this.props.songData}
          songPlayerStatus={this.props.songPlayerStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />

        <style jsx>{`
          .playable-grid-song {
            position: relative;
            display: inline-block;
            vertical-align: top;
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
