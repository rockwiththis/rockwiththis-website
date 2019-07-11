import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { propTypes } from './index';
import GridSong from 'components/song-grid/playable';

export default class SnapshotListViewDesktop extends Component {

  static propTypes = propTypes;

  render = () => (
      <div className="snapshot-list-view-desktop" onScroll={this.handleViewScroll}>
        { this.props.filteredSongPosts.map(songData => (
            <GridSong
              songData={songData}
              songPlayStatus={this.props.songPlayStatusForSong(songData)}
              songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
            />
        ))}

      <style jsx>{`
        .snapshot-list-view-desktop {
          width: 80%;
          margin: 0 auto;
          min-width: 1200px;
        }
      `}</style>
      <style global jsx>{`
        .snapshot-list-view-desktop .playable-grid-song {
          width: 25%;
        }
      `}</style>
      </div>
  );
}
