import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';
import moment from 'moment';

import BadgeSingleSongControls from 'components/buttons/single-song-controls/badge';

export default class SongDetails extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
  }

  render = () => (
      <div className="song-details">
        <BadgeSingleSongControls
          songPlayerStatus={this.props.songPlayerStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />
        <Link href={`/songs/${this.props.songData.id}`}>
          <div className="song-info">
            <span className="song-title">{this.props.songData.name}</span>
            <span className="song-artist">{this.props.songData.artist_name}</span>
          </div>
        </Link>
        <div className="post-date">
            <span className="month">{moment(this.props.songData.created_at).format('ddd')}</span>
            <span className="day">{moment(this.props.songData.created_at).format('D')}</span>
        </div>

        <style jsx>{`
          .song-details {
            position: absolute;
            bottom: 0;
            height: 42px;
            width: 100%;
            z-index: 2;
            background: rgba(255, 255, 255, 0.9);
          }
          .song-info {
            display: inline-block;
            width: calc(100% - 37px - 40px);
            font-size: 10pt;
            white-space: nowrap;
            vertical-align: top;
            height: 100%;
            padding-top: 5px;
            padding-left: 5px;
            box-sizing: border-box;
          }
          .song-info span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          }
          .song-title {
            font-weight: bold;
          }
          .post-date {
            display: inline-block;
            background-color: black;
            color: white;
            width: 40px;
            height: 100%;
            vertical-align: top;
            text-align: center;
            padding-top: 5px;
            box-sizing: border-box;
          }
          .post-date span {
            display: block;
          }
          .month {
            font-size: 8pt;
          }
          .day {
            font-size: 12pt;
          }
        `}</style>
        <style global jsx>{`
          .badge-single-song-controls {
            height: 35px;
            width: 35px;
            display: inline-block;
            margin-top: 4px;
            margin-left: 2px;
            box-sizing: border-box;
          }
          .
        `}</style>
      </div>
  )
}
