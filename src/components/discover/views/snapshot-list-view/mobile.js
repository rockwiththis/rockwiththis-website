import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa';

import { propTypes } from './index';

export default class SnapshotListViewMobile extends Component {

  static propTypes = propTypes;

  render = () => (
      <div className="snapshot-list-view-mobile" onScroll={this.handleViewScroll}>
        { this.props.filteredSongPosts.map(songData => (
            <Link href={`/songs/[id]?id=${songData.id}`} as={`/songs/${songData.id}`}>
              <div className="snapshot-song">
                <img src={songData.image_url} />
                <div className="song-details">
                  <div className="song-name">{songData.name}</div>
                  <div className="artist-name">{songData.artist_name}</div>
                </div>
                <div className="right-arrow"><FaAngleRight /></div>
              </div>
            </Link>
        ))}

        <style jsx>{`
          .snapshot-song {
            border-bottom: 1px solid #e0e0e0;
            padding: 10px;
            box-sizing: border-box;
          }
          img {
            display: inline-block;
            width: 40px;
            height: 40px;
            padding-right: 10px;
          }
          .song-details {
            display: inline-block;
            vertical-align: top;
            width: calc(100% - 50px - 10px - 20px);
            padding-top: 5px;
          }
          .song-details div {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            padding-right: 20px;
          }
          .song-name {
            font-weight: bold;
          }
          .right-arrow {
            display: inline-block;
            vertical-align: top;
            padding-top: 12px;
            font-size: 14pt;
            text-align: center;
          }
        `}</style>
      </div>
  );
}
