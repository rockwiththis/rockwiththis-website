import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Desktop from './desktop';
import Mobile from './mobile';

export const propTypes = {
  filteredSongPosts: PropTypes.array.isRequired,
  songPlayStatusForSong: PropTypes.func.isRequired,
  songPlayerFunctionsForSong: PropTypes.func.isRequired,
  songDataFunctions: PropTypes.object.isRequired
}

export default class SnapshotListView extends Component {

  static propTypes = propTypes;

  handleViewScroll = e => {
    const scrollThreshold = e.target.scrollHeight - (e.target.offsetHeight + 100);

    if (e.target.scrollTop > scrollThreshold && !this.props.songDataFunctions.isLoading)
      this.props.songDataFunctions.loadMore();
  }

  // TODO load more on scroll

  render = () => (
      <div className="snapshot-list-view" onScroll={this.handleViewScroll}>

        <Desktop {...this.props} />
        <Mobile {...this.props} />

        <style jsx global>{`
          @media (min-width: 800px) {
            .snapshot-list-view .snapshot-list-view-mobile {
              display: none
            }
          }
          @media (max-width: 800px) {
            .snapshot-list-view .snapshot-list-view-desktop {
              display: none
            }
          }
        `}</style>
      </div>
  )
}
