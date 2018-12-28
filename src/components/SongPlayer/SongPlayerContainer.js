import React from 'react';
import PropTypes from 'prop-types';
import PlayerWrapper from './PlayerWrapper'

const propTypes = {
  songPosts: PropTypes.array.isRequired,
  currentSongId: PropTypes.number,
  isPlaying: PropTypes.bool.isRequired,
  onSongProgress: PropTypes.func.isRequired,
  onSongEnd: PropTypes.func.isRequired
};

class SongPlayerContainer extends React.Component {

  // only re-render container when we load more songs or toggle play
  shouldComponentUpdate = nextProps => (
      nextProps.isPlaying !== this.props.isPlaying ||
      nextProps.songPosts.length !== this.props.songPosts.length
  );

  isSongPlaying = song => (
      this.props.isPlaying &&
      this.props.currentSongId === song.id
  );

  render() {
    return (
        <div className="song-player-wrapper" style style={{ display: 'none' }}>

          {this.props.songPosts.map(song => (
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
