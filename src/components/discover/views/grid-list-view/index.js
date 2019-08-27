import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { songDataShape, songPlayerShape } from 'constants/prop-shapes';

import LoadingSpinner from '../loading-spinner';
import Desktop from './desktop';
import Mobile from './mobile';

export const propTypes = {
  songData: PropTypes.exact(songDataShape).isRequired,
  songPlayers: PropTypes.objectOf(PropTypes.exact(songPlayerShape)).isRequired,
  disableScroll: PropTypes.bool,
  handleSongListScroll: PropTypes.func.isRequired
}

export default class GridListView extends Component {

  static propTypes = propTypes

  render = () => (
      <div className="grid-list-view" onScroll={this.props.handleSongListScroll}>

        <Desktop {...this.props} />
        <Mobile {...this.props} />

        {this.props.songData.isLoading && <LoadingSpinner />}

        <style jsx>{`
          .grid-list-view {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            height: 100%;
            overflow-y: ${ this.props.disableScroll ? 'hidden' :  'scroll' };
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .grid-list-view::-webkit-scrollbar {
            width: 0px;
          }
        `}</style>
        <style jsx global>{`
          @media (min-width: 800px) {
            .grid-list-view .grid-list-view-mobile {
              display: none
            }
          }
          @media (max-width: 800px) {
            .grid-list-view .grid-list-view-desktop {
              display: none
            }
          }
        `}</style>
      </div>
  );
}
