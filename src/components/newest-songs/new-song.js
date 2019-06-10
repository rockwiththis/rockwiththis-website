import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

import SongImage from './song-image';
import SongPostDetails from './song-post-details';

class NewSong extends Component {

  static propTypes = {
    // TODO define expected structures in a shared place
    songData: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
    isSongOfTheDay: PropTypes.bool.isRequired
  }

  render = () => (
      <div className="newest-songs-song">
         <SongImage
          songData={this.props.songData} 
          isSongOfTheDay={this.props.isSongOfTheDay}
        />
        <SongPostDetails
          songData={this.props.songData}
          songPlayerStatus={this.props.songPlayerStatus}
          songPlayerFunctions={this.props.songPlayerFunctions}
        />
      </div>
  );
}

export default NewSong;
