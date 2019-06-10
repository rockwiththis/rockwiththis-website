import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';
import moment from 'moment';

import BadgeSingleSongControls from 'components/buttons/single-song-controls/badge';

class SongPostDetails extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
  }

  render = () => (
      <div className="post-details">
        <BadgeSingleSongControls
          songPlayerStatus={this.props.songPlayerStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />
        <Link href={`/songs/${this.props.songData.id}`}>
          <div className="song-info">
            <p className="song-title">{this.props.songData.name}</p>
            <p className="song-artist">{this.props.songData.artist_name}</p>
            <div className="post-date">
                <p className="month">{moment(this.props.songData.created_at).format('ddd')}</p>
                <p className="day">{moment(this.props.songData.created_at).format('D')}</p>
            </div>
          </div>
        </Link>
      </div>
  )
}

export default SongPostDetails;
