import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { propTypes } from './index';
import TruncatedSongPost from 'components/song-post/truncated';

export default class GridListViewDesktop extends Component {

  static propTypes = propTypes

  render = () => (
      <div className="grid-list-view-desktop">
        {this.props.filteredSongPosts.map(songData => (
            <TruncatedSongPost
              key={songData.id}
              songData={songData}
              songPlayStatus={this.props.songPlayStatusForSong(songData)}
              songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
            />
        ))}

        <style jsx>{`
          .grid-list-view-desktop {
            padding-top: 20px;
          }
        `}</style>
        <style jsx global>{`
          .grid-list-view-desktop .truncated-song-post {
            width: 48%;
            height: 250px;
            display: inline-block;
            vertical-align: top;
            margin: 20px 1%;
          }
        `}</style>
      </div>
  );
}

