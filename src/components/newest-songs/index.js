import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'

import NewSong from './new-song';
import Placeholder from './placeholder';

class NewestSongs extends React.Component {

  static propTypes = {
    newestSongPosts: PropTypes.array.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired
  }

  render = () => (
      <div className="newest-songs">
        {this.props.newestSongPosts.length > 0 ?
          this.props.newestSongPosts.map((songData, i) => (
              <NewSong
                key={songData.id}
                songData={songData}
                songPlayStatus={this.props.songPlayStatusForSong(songData)}
                songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
                isFeaturedSong={i === 0}
              />
          ))
          :
          <Placeholder />
        }
      </div>
  );
}

export default NewestSongs;
