import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaSpotify } from 'react-icons/fa';

import { songPlayerShape } from 'constants/prop-shapes';

import HeaderTitle from './title';
import MetaInfo from './meta-info';
import SongPlayerControl from 'components/song-player-control/outline';

export default class SongHeader extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayer: PropTypes.exact(songPlayerShape).isRequired
  }

  render = () => (
      <div className="song-header">

        <SongPlayerControl songPlayer={this.props.songPlayer} />
        <HeaderTitle songData={this.props.songData} />
        <MetaInfo songData={this.props.songData} />

        <style global jsx>{`
          .song-header .song-player-control {
            display: inline-block;
            width: 60px;
            height: 60px;
          }
          .song-header .header-title {
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            padding-left: 10px;
            width: calc(100% - 60px); // MUST override if play button visible + text wraps image
          }
        `}</style>
      </div>
  );
};
