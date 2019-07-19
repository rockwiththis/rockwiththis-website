import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { propTypes } from './index';
import SongTile from 'components/song-tile';

export default class GridListViewDesktop extends Component {

  static propTypes = propTypes;

  render = () => (
      <div className="grid-list-view-desktop" onScroll={this.handleViewScroll}>
        { this.props.songData.filtered.map(songData => (
            <SongTile
              key={songData.id}
              songData={songData}
              songPlayer={this.props.songPlayers(songDawta)}
            />
        ))}

      <style jsx>{`
        .grid-list-view-desktop {
          width: 80%;
          margin: 0 auto;
          min-width: 1200px;
        }
      `}</style>
      <style global jsx>{`
        .grid-list-view-desktop .song-tile {
          width: 25%;
        }
      `}</style>
      </div>
  );
}
