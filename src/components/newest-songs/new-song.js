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
        <style global jsx>{`
          .newest-songs-song {
            position: relative;
            display: inline-block;
            vertical-align: top;
            height: 20vw;
            width: 20vw;
          }
          .newest-songs-song.featured-song {
            height: 40vw;
            width: 40vw;
            float: left;
          }
        `}</style>
      </div>
  );
}

export default NewSong;
