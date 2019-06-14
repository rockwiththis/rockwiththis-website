import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'

import NewSong from './new-song';
import Placeholder from './placeholder';

class NewestSongs extends React.Component {

  static propTypes = {
    newestSongPosts: PropTypes.array.isRequired,
    getSongPlayStatus: PropTypes.func.isRequired,
    getSongPlayerFunctions: PropTypes.func.isRequired
  }

  render = () => (
      <div className="newest-songs">
        {this.props.newestSongPosts.length > 0 ?
          this.props.newestSongPosts.map((songData, i) => (
              <NewSong
                key={songData.id}
                songData={songData}
                songPlayStatus={this.props.getSongPlayStatus(songData)}
                songPlayerFunctions={this.props.getSongPlayerFunctions(songData)}
                isFeaturedSong={i === 0}
              />
          ))
          :
          <Placeholder />
        }
        <style jsx>{`
          .newest-songs {
            height: 674px;
          }
        `}</style>
      </div>
  );
}

export default NewestSongs;
