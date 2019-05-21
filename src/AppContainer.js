import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { uniqBy } from 'lodash';

import * as BindActions from 'actions/bind-with-dispatch';

import { loadMoreSongs } from 'actions/fetch/songs';
import { playSong } from 'actions/player';
import { didAutoplayFail } from 'actions/set-state';

import SocialLinks from 'components/SocialLinks/SocialLinks.js';
import Header from 'components/Header/Header.js';
import FooterAudioPlayer from 'components/footer-audio-player';
import AudioManager from 'components/audio-manager';

const propTypes = {
  // Redux
  actions: PropTypes.object,   // TODO stop using this
  loadMoreSongs: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired
}

const AUTOPLAY_CHECK_INTERVAL = 2000;

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { shrinkHeader: false };
    this.mainPageScroll = 0;
    this.discoveryScroll = 0;

    this.audioManagerRef = React.createRef();
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const shrinkHeader = window.scrollY > 70;
    this.setState({ shrinkHeader });
  }

  // TODO there *has* to be a better way of calling player bank functions
  // Maybe putting the bank ref in the app store (like we did for song list)?
  // Calling these *before* re-rendering would probably cause significant performance improvement
  componentDidUpdate = prevProps => {

    if (!this.props.isPlaying && prevProps.isPlaying) {
      this.audioManagerRef.current.pauseActiveSong();
    }

    if (prevProps.activeSong.id !== this.props.activeSong.id &&
        this.props.isPlaying) {
      this.audioManagerRef.current.playSongListSong(this.props.activeSong);

    } else if (this.props.isPlaying && !prevProps.isPlaying) {
      this.audioManagerRef.current.playActiveSong();

    } else if (!!this.props.nextSong) {
      this.audioManagerRef.current.loadAndPlaySong(this.props.nextSong)
    }

    if (this.props.shouldLoadPlayers) {
      const currActiveSongs = uniqBy(
        [
          this.props.activeSong,
          ...this.props.heroPosts,
          ...this.props.filteredPosts,
          this.props.spotlightPost,
          this.props.singleSong
        ].filter(s => !!s && !!s.id),
        song => song.id
      );
      this.audioManagerRef.current.setActiveSongs(currActiveSongs);
      this.props.actions.playerBankUpdated();
    }
  };

  playNextSong = (isAutoplay = false) => () => {
    const nextIndex = this.props.filteredPosts.findIndex(song => song.id === this.props.activeSong.id) + 1;

    if (nextIndex >= this.props.filteredPosts.length) {
      this.props.loadMoreSongs()
        .then(newSongs => this.props.playSong(newSongs[0]));

    } else {
      this.props.playSong(this.props.filteredPosts[nextIndex]);
    }

    if (isAutoplay) setTimeout(this.checkAutoplayStatus, AUTOPLAY_CHECK_INTERVAL);
  }

  findPreviousSong = () => {
    const prevIndex = this.props.filteredPosts.findIndex(song => song.id === this.props.activeSong.id) - 1;
    if (prevIndex < 0) return null;

    return this.props.filteredPosts[prevIndex];
  }

  checkAutoplayStatus = () =>
    this.audioManagerRef.current.fetchIsActivePlayerPlaying().then(isPlaying => {
      if (!isPlaying) this.props.autoplayDidFail();
    });

  handleProgressUpdate = progressRatio =>
    this.audioManagerRef.current.updateSongProgress(progressRatio)

  setMainPageScroll = newScrollPos => this.mainPageScroll = newScrollPos;

  setDiscoveryScroll = newScrollPos => this.discoveryScroll = newScrollPos;

  render() {

    return (
        <div>
          <Header {...this.props} shrinkHeader={this.state.shrinkHeader} />

          { React.cloneElement(this.props.children, this.props) }

          <FooterAudioPlayer
            onProgressUpdate={this.handleProgressUpdate}
            playNextSong={this.playNextSong()}
            previousSong={this.findPreviousSong()}
            {...this.props}
          />
          {
            !!this.props.activeSong && !!this.props.activeSong.id &&
            <AudioManager
              setSongDuration={this.props.actions.playerLoaded}
              setActiveSongProgress={this.props.actions.setSongProgress}
              playSong={this.props.playSong}
              onSongEnd={this.playNextSong(true)}
              ref={this.audioManagerRef}
            />
          }
        </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => Object.assign(state, ownProps)

const mapDispatch = (dispatch) => {
  return {
    actions: bindActionCreators(BindActions, dispatch),
    loadMoreSongs: () => dispatch(loadMoreSongs()),
    playSong: (song, duration) => dispatch(playSong(song, duration)),
    autoplayDidFail: () => dispatch(didAutoplayFail(true))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatch)(AppContainer)
)
