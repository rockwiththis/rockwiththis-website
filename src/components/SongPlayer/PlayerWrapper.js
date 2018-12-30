import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './SongPlayer.scss'


const propTypes = {
  songPost: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onSongProgress: PropTypes.func.isRequired,
  onSongEnd: PropTypes.func.isRequired
};

// Wrapper to give us greater control over when a player is re-rendered
class PlayerWrapper extends React.Component {

  // only re-render an indivial player when `isPlaying` prop changes
  shouldComponentUpdate = nextProps => (
      nextProps.isPlaying !== this.props.isPlaying
  );

  reportProgressIfPlaying = ref => {
    if (this.props.isPlaying) this.props.onSongProgress(ref);
  };

  reactPlayerReady = () => (
      console.log(`Song ${this.props.songPost.id} ready to be played`)
  );

  render() {
    console.log(`Rendering player for song ${this.props.songPost.id}`);
    const songUrl = (
        this.props.songPost.soundcloud_track_id ?
          `https%3A//api.soundcloud.com/tracks/${this.props.songPost.soundcloud_track_id}` :
          this.props.songPost.youtube_link
    );
    return (
        <ReactPlayer
          playing={this.props.isPlaying}
          onReady={this.reactPlayerReady}
          onProgress={this.reportProgressIfPlaying}
          onEnded={this.props.onSongEnd}
          url={songUrl}
        />
    );
  }
}

PlayerWrapper.propTypes = propTypes;

export default PlayerWrapper;
