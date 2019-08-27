import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { propTypes } from './index';
import LoadingSpinner from '../loading-spinner';
import TruncatedSongPost from 'components/song-post/truncated';

export default class FullViewMobile extends Component {

  static propTypes = propTypes;

  render = () => (
      <div className="full-view-mobile" onScroll={this.props.handleSongListScroll}>
        {this.props.songData.filtered.map(songData => (
            <TruncatedSongPost
              key={songData.id}
              songData={songData}
              songPlayer={this.props.songPlayers[songData.id]}
              hideSongControls={true}
            />
        ))}
        {this.props.songData.isLoading && <LoadingSpinner />}

        <style jsx>{`
          .full-view-mobile {
            height: 100%;
            overflow-y: ${ this.props.disableScroll ? 'hidden' :  'scroll' };
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .full-view-mobile::-webkit-scrollbar {
            width: 0px;
          }
        `}</style>
        <style global jsx>{`
          .full-view-mobile .truncated-song-post {
            height: 140px;
            padding: 10px;
          }
          .full-view-mobile .song-image {
            width: 120px !important;
            height: 120px;
            margin-top: 10px;
          }
          .full-view-mobile .song-player-control {
            display: none !important;
          }
          .full-view-mobile .header-title {
            padding: 0 !important;
          }
          .full-view-mobile .song-name {
            font-size: 16px;
          }
          .full-view-mobile .song-artist {
            font-size: 16px;
            margin-top: 2px;
          }
          .full-view-mobile .meta-info {
            font-size: 14px !important;
          }
          .full-view-mobile .song-post-content {
            height: 55px !important;
            overflow: hidden !important;
            font-size: 11px !important;
          }
          .full-view-mobile .song-post-content p {
            line-height: 18px !important;
          }
          .full-view-mobile .see-more {
            margin: 0 !important;
          }
        `}</style>
      </div>
  )
}
