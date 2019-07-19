import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';

import { songPlayerPropTypes } from 'constants/prop-types';
 
import SongPost from './index';

// TODO is there a better way to share components code w/ different styles

export default class TruncatedSongPost extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayer: songPlayerPropTypes.isRequred,
    hideSongControls: PropTypes.bool
  }

  render = () => (
      <div className="truncated-song-post">

        <SongPost {...this.props} />

        <Link href={`/songs/[id]?id=${this.props.songData.id}`} as={`/songs/${this.props.songData.id}`}>
          <div className="see-more">
            ...see more
            <IoIosArrowForward />
          </div>
        </Link>
        <hr />

        <style jsx>{`
          .truncated-song-post {
            overflow: hidden;
          }
          .see-more {
            margin: 15px 0;
            font-size: 10pt;
            text-align: right;
          }
        `}</style>
        <style jsx global>{`
          .truncated-song-post .song-image {
            width: 35%;
            padding-right: 20px;
            padding-bottom: 20px;
            box-sizing: border-box;
          }
          .truncated-song-post .header-title {
            // TODO should we fix the entire header width instead?
            // also, the 20px padding is not actually used b/c the image is a border-box
            // -35% for image, -20px for padding, -50px for play button
            width: calc(65% - 20px - 40px);
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
          .list -view .meta-info {
            font-size: 12pt;
          }
          .truncated-song-post .song-post-content p {
            margin: 0;
            font-size: 10pt;
            line-height: 20pt;
          }
          .truncated-song-post .outline-single-song-controls {
            display: this.props.hideSongControls ? 'none' : 'default';
            width: 40px;
            height: 40px;
          }
        `}</style>
      </div>
  )
}
