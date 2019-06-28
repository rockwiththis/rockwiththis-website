import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GridSong from 'components/song-grid/playable';

export default class SnapshotListView extends Component {

  static propTypes = {
    filteredSongPosts: PropTypes.array.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired,
    songDataFunctions: PropTypes.object.isRequired
  }

  handleViewScroll = e => {
    const scrollThreshold = e.target.scrollHeight - (e.target.offsetHeight + 100);

    if (e.target.scrollTop > scrollThreshold && !this.props.songDataFunctions.isLoading)
      this.props.songDataFunctions.loadMore();
  }

  render = () => (
      <div className="snapshot-list-view" onScroll={this.handleViewScroll}>
        { this.props.filteredSongPosts.map(songData => (
            <GridSong
              songData={songData}
              songPlayStatus={this.props.songPlayStatusForSong(songData)}
              songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
            />
        ))}

      <style jsx>{`
        .snapshot-list-view {
          width: 80%;
          margin: 0 auto;
          min-width: 1200px;
        }
      `}</style>
      <style global jsx>{`
        .snapshot-list-view .playable-grid-song {
          width: 25%;
        }
      `}</style>
      </div>
  )
}
