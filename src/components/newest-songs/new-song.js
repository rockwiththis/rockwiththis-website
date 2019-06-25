import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

import SongImage from './song-image';
import SongPostDetails from './song-post-details';

class NewSong extends Component {

  static propTypes = {
    // TODO define expected structures in a shared place
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
    isFeaturedSong: PropTypes.bool.isRequired
  }

  render = () => (
      <div
        className={
          "newest-songs-song" +
          (this.props.isFeaturedSong ? " featured-song" : "")
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
        <style global jsx>{`
          .newest-songs-song {
            position: relative;
            display: inline-block;
            vertical-align: top;
            height: 20vw;
            width: 20vw;
            max-width: calc(1658px * 0.2);
            max-height: calc(1658px * 0.2);
          }
          .newest-songs-song.featured-song {
            height: 40vw;
            width: 40vw;
            max-width: calc(1658px * 0.4);
            max-height: calc(1658px * 0.4);
            float: left;
          }
        `}</style>
      </div>
  );
}

export default NewSong;
