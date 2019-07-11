import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { propTypes } from './index';
import TruncatedSongPost from 'components/song-post/truncated';

export default class FullViewMobile extends Component {

  static propTypes = propTypes;

  render = () => (
      <div className="full-view-mobile">
        {this.props.songPosts.filtered.map(songData => (
            <TruncatedSongPost
              songData={songData}
              songPlayStatus={this.props.songPlayStatusForSong(songData)}
              songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
              hideSongControls={true}
            />
        ))}
      </div>
  )
}
