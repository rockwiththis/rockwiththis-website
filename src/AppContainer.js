import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as BindActions from 'actions/bind-with-dispatch';

import { loadMoreSongs } from 'actions/fetch/songs';
import { playSong } from 'actions/player';

import SocialLinks from 'components/SocialLinks/SocialLinks.js';
import Header from 'components/Header/Header.js';
import MainPlayer from 'components/FooterPlayer/MainPlayer';
import SongPlayerBank from 'components/SongPlayer/SongPlayerBank';

const propTypes = {
  // Redux
  actions: PropTypes.object,   // TODO stop using this
  loadMoreSongs: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired
}

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { shrinkHeader: false };
    this.mainPageScroll = 0;
    this.discoveryScroll = 0;

    this.playerBankRef = React.createRef();
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
      this.playerBankRef.current.pauseActiveSong();
    }

    if (prevProps.activeSong.id !== this.props.activeSong.id &&
        this.props.isPlaying) {
      this.playerBankRef.current.playSongListSong(this.props.activeSong);

    } else if (this.props.isPlaying && !prevProps.isPlaying) {
      this.playerBankRef.current.playActiveSong();
    }

    if (this.props.shouldLoadPlayers) {
      const playerSongs = [
        ...this.props.filteredPosts,
        this.props.spotlightPost,
        this.props.singleSong
      ].filter(song => !!song && !!song.id);

      this.playerBankRef.current.setSongListPlayers(playerSongs);
      this.props.activeSong && this.playerBankRef.current.ensureActivePlayer(this.props.activeSong);
      this.props.actions.playerBankUpdated();
    }
  };

  playNextSong = () => {
    const nextIndex = this.props.filteredPosts.findIndex(song => song.id === this.props.activeSong.id) + 1;

    if (nextIndex >= this.props.filteredPosts.length) {
      this.props.loadMoreSongs()
        .then(newSongs => this.props.playSong(newSongs[0]));

    } else {
      this.props.playSong(this.props.filteredPosts[nextIndex]);
    }
  }

  handleProgressUpdate = progressRatio => {
      this.playerBankRef.current.updateSongProgress(progressRatio)
  };

  setMainPageScroll = newScrollPos => this.mainPageScroll = newScrollPos;

  setDiscoveryScroll = newScrollPos => this.discoveryScroll = newScrollPos;

  render() {
    return (
        <div>
          <Header {...this.props} shrinkHeader={this.state.shrinkHeader} />

          { React.cloneElement(this.props.children, this.props) }

          <MainPlayer
            onProgressUpdate={this.handleProgressUpdate}
            playNextSong={this.playNextSong}
            {...this.props}
          />
          {
            !!this.props.activeSong && !!this.props.activeSong.id &&
            <SongPlayerBank
              heroSongs={this.props.heroPosts}
              initialSongList={this.props.filteredPosts}
              initialActiveSong={this.props.activeSong}
              setSongDuration={this.props.actions.playerLoaded}
              setActiveSongProgress={this.props.actions.setSongProgress}
              onSongEnd={this.playNextSong}
              ref={this.playerBankRef}
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
    playSong: song => dispatch(playSong(song))
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatch)(AppContainer)
)
