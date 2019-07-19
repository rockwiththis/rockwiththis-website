import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { songDataPropTypes, songPlayerPropTypes } from 'constants/prop-types';

import LoadingSpinner from '../loading-spinner';
import Desktop from './desktop';
import Mobile from './mobile';

export const propTypes = {
  songData: songDataPropTypes.isRequired,
  songPlayers: PropTypes.func.isRequired
}

export default class SnapshotListView extends Component {

  static propTypes = propTypes;

  handleViewScroll = e => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight)
      this.props.songData.loadMore();
  }

  // TODO load more on scroll

  render = () => (
      <div className="snapshot-list-view" onScroll={this.handleViewScroll}>

        <Desktop {...this.props} />
        <Mobile {...this.props} />

        {this.props.songData.isLoading && <LoadingSpinner />}

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
