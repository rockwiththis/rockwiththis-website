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
      </div>
  )
}
