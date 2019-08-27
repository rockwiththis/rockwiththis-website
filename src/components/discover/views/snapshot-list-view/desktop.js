import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { propTypes } from './index';
import TruncatedSongPost from 'components/song-post/truncated';

export default class SnapshotListViewDesktop extends Component {

  static propTypes = propTypes

  render = () => (
      <div className="snapshot-list-view-desktop">

        {this.props.songData.filtered.map(songData => (
            <TruncatedSongPost
              key={songData.id}
              songData={songData}
              songPlayer={this.props.songPlayers[songData.id]}
            />
        ))}

        <style jsx>{`
          .snapshot-list-view-desktop {
            padding-top: 20px;
          }
        `}</style>
        <style jsx global>{`
          .snapshot-list-view-desktop .truncated-song-post {
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

