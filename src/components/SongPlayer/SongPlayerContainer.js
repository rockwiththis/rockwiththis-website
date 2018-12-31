import React from 'react';
import PropTypes from 'prop-types';
import PlayerWrapper from './PlayerWrapper'
import { uniqBy } from 'lodash';

const propTypes = {
  songPosts: PropTypes.array.isRequired,
  currentSongId: PropTypes.number,
  isPlaying: PropTypes.bool.isRequired,
  onSongLoading: PropTypes.func.isRequired,
  onSongLoaded: PropTypes.func.isRequired,
  onSongProgress: PropTypes.func.isRequired,
  onSongEnd: PropTypes.func.isRequired
};

class SongPlayerContainer extends React.Component {

  constructor(props) {
    super(props);
    this.activePlayerRef = React.createRef();
  }

  isSongPlaying = song => (
      this.props.isPlaying &&
      this.props.currentSongId === song.id
  );

  getUniqueSongPosts = () => uniqBy(this.props.songPosts, 'id');

  updateSongProgress = progressRatio => {
      console.log(this.activePlayerRef.current)
      this.activePlayerRef.current.updateSongProgress(progressRatio)
  };

  render() {
    return (
        <div className="song-player-wrapper">

          {this.getUniqueSongPosts().map(song => (
              <PlayerWrapper
                songPost={song}
                isPlaying={this.isSongPlaying(song)}
                onSongLoading={this.props.onSongLoading}
                onSongLoaded={this.props.onSongLoaded}
                onSongProgress={this.props.onSongProgress}
                onSongEnd={this.props.onSongEnd}
                ref={this.isSongPlaying(song) && this.activePlayerRef}
              />
          ))}

        </div>
    );
  }
}

SongPlayerContainer.propTyps = propTypes;

export default SongPlayerContainer;
