import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'

import NewSongGridSong from 'components/song-grid/playable';
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
              <NewSongGridSong
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
        
        <style jsx global>{`
          .newest-songs .playable-grid-song {
            height: 20vw;
            width: 20vw;
            max-width: calc(1658px * 0.2);
            max-height: calc(1658px * 0.2);
          }
          .newest-songs .playable-grid-song.featured-song {
            height: 40vw;
            width: 40vw;
            max-width: calc(1658px * 0.4);
            max-height: calc(1658px * 0.4);
            float: left;
          }
        `}</style>
      </div>
  );
}

export default NewestSongs;
