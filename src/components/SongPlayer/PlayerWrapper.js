import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { loadingPlayer, playerLoaded } from 'actions';

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
      nextProps.isPlaying !== this.props.isPlaying ||
      nextProps.songPost.id !== this.props.songPost.id
  );

  reportProgressIfPlaying = ref => {
    if (this.props.isPlaying) this.props.onSongProgress(ref);
  };

  reactPlayerReady = ref => (
      this.props.reportPlayerLoaded(this.props.songPost, ref.getDuration())
  );

  render() {
    this.props.reportLoadingPlayer(this.props.songPost);
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

const mapDispatchToProps = {
  reportLoadingPlayer: loadingPlayer,
  reportPlayerLoaded: playerLoaded
}

export default connect(null, mapDispatchToProps)(PlayerWrapper);
