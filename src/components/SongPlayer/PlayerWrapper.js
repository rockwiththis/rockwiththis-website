import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { loadingPlayer, playerLoaded } from 'actions';

import './SongPlayer.scss'

const propTypes = {
  songPost: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onSongLoading: PropTypes.func.isRequired,
  onSongLoaded: PropTypes.func.isRequired,
  onSongProgress: PropTypes.func.isRequired,
  onSongEnd: PropTypes.func.isRequired
};

// Wrapper to give us greater control over when a player is re-rendered
class PlayerWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.playerRef = React.createRef();
  }

  // only re-render an indivial player when `isPlaying` prop changes
  shouldComponentUpdate = nextProps => (
      nextProps.isPlaying !== this.props.isPlaying ||
      nextProps.songPost.id !== this.props.songPost.id
  );

  reportProgressIfPlaying = ref => {
    if (this.props.isPlaying) this.props.onSongProgress(ref);
  };

  reactPlayerReady = ref => (
      this.props.onSongLoaded(this.props.songPost, ref.getDuration())
  );

  updateSongProgress = progressRatio => (
      this.playerRef.current.seekTo(progressRatio)
  );

  render() {
    this.props.onSongLoading(this.props.songPost);
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
          ref={this.playerRef}
        />
    );
  }
}

PlayerWrapper.propTypes = propTypes;

// TODO get react-redux `connect` working with refs and use instead of passing actions as params
export default PlayerWrapper;
