import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';

import { songPlayerShape } from 'constants/prop-shapes';
 
import SongPost from './index';

// TODO is there a better way to share components code w/ different styles

export default class TruncatedSongPost extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayer: PropTypes.exact(songPlayerShape).isRequired,
    hideSongControls: PropTypes.bool
  }

  render = () => (
      <Link href={`/songs/[id]?id=${this.props.songData.id}`} as={`/songs/${this.props.songData.id}`}>
        <div className="truncated-song-post">

          <SongPost {...this.props} />

          <div className="see-more">
            ...see more
            <IoIosArrowForward />
          </div>
          <hr />

          <style jsx>{`
            .truncated-song-post {
              overflow: hidden;
            }
            .see-more {
              margin: 15px 0;
              font-size: 10pt;
              text-align: right;
              cursor: pointer;
            }
            hr {
              color: #c9c6cb;
              height: 1px;
            }
          `}</style>
          <style jsx global>{`
            .truncated-song-post .song-image {
              width: 30%;
              padding-right: 20px;
              padding-bottom: 20px;
              box-sizing: border-box;
            }
            .truncated-song-post .header-title {
              width: calc(70% - 40px);
              font-size: 16pt;
            }
            .truncated-song-post .spotify-link {
              display: none;
            }
            .truncated-song-post .song-post-content {
              height: 125px;
              position: relative;
              overflow: hidden;
            }
            .truncated-song-post .meta-info {
              font-size: 12pt;
            }
            .truncated-song-post .badges {
              display: none;
            }
            .truncated-song-post .song-post-content p {
              margin: 0;
              font-size: 10pt;
              line-height: 20pt;
            }
            .truncated-song-post .song-player-control {
              display: this.props.hideSongControls ? 'none' : 'default';
              width: 40px;
              height: 40px;
            }
          `}</style>
        </div>
      </Link>
  )
}
