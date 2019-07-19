import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { songPlayerPropTypes } from 'constants/prop-types';

import SongHeader from './header';
import SongPostContent from './content';

export default class SongPost extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayer: songPlayerPropTypes.isRequred
  }

  separateParagraphs = text => text.split(/\n+/g);

  render = () => (
      <div className="song-post">

        <img className="song-image" src={this.props.songData.image_url} />
        <SongHeader
          songData={this.props.songData}
          songPlayer={this.props.songPlayer}
        />
        <SongPostContent songData={this.props.songData} />

        <style jsx>{`
          .song-image {
            float: left;
          }
        `}</style>
        <style global jsx>{`
          .song-header {
            width: 100%;
          }
        `}</style>
      </div>
  )
}
