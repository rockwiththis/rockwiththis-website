import React from 'react';
import PropTypes from 'prop-types';
import PlayerWrapper from './PlayerWrapper'
import { uniqBy } from 'lodash';

const propTypes = {
  songPosts: PropTypes.array.isRequired,
  currentSongId: PropTypes.number,
  isPlaying: PropTypes.bool.isRequired,
  onSongProgress: PropTypes.func.isRequired,
  onSongEnd: PropTypes.func.isRequired
};

class SongPlayerContainer extends React.Component {

  isSongPlaying = song => (
      this.props.isPlaying &&
      this.props.currentSongId === song.id
  );

  getUniqueSongPosts = () => uniqBy(this.props.songPosts, 'id');

  render() {
    console.log("Rendering player container");
    return (
        <div className="song-player-wrapper">

          {this.getUniqueSongPosts().map(song => (
              <PlayerWrapper
                songPost={song}
                isPlaying={this.isSongPlaying(song)}
                onSongProgress={this.props.onSongProgress}
                onSongEnd={this.props.onSongEnd}
              />
          ))}

        </div>
    );
  }
}

SongPlayerContainer.propTyps = propTypes;

export default SongPlayerContainer;
