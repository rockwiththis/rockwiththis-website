import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaSpotify } from 'react-icons/fa';

import { songPlayerPropTypes } from 'constants/prop-types';

import HeaderTitle from './title';
import MetaInfo from './meta-info';
import OutlineSingleSongControls from 'components/buttons/single-song-controls/outline';

export default class SongHeader extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayer: songPlayerPropTypes.isRequred
  }

  render = () => {
    const songId = this.props.songData.id;

    return (
        <div className="song-header">

          <OutlineSingleSongControls songPlayer={this.props.songPlayerStatus} />

          <HeaderTitle songData={this.props.songData} />

          <MetaInfo songData={this.props.songData} />

          <style global jsx>{`
            .song-header .outline-single-song-controls {
              display: inline-block;
              width: 60px;
              height: 60px;
            }
            .song-header .outline-single-song-controls svg {
              width: 100%;
              height: 100%;
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
  }
};
