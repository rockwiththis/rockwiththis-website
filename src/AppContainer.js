import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { fetchFilters } from 'actions/filters'
import * as BindActions from 'actions/bind-with-dispatch'
import SocialLinks from 'components/SocialLinks/SocialLinks.js'
import Header from 'components/Header/Header.js'
import MainPlayer from 'components/FooterPlayer/MainPlayer'
import SongPlayerBank from 'components/SongPlayer/SongPlayerBank';

// TODO proptypes

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { shrinkHeader: false };
    this.mainPageScroll = 0;
    this.discoveryScroll = 0;

    this.playerBankRef = React.createRef();

    this.props.actions.fetchFilters()
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

  // This is now broken ...
  changeSongOnEnd = () => {
    const nextIndex = this.props.filteredPosts.findIndex(song => song.id === this.props.activeSong.id) + 1;

    if (nextIndex >= this.props.filteredPosts.length) {
      console.log("loading more songs");
      this.props.actions.loadMoreSongs(nextSongs => {
        console.log("in callback");
        console.log(nextSongs);
          this.props.actions.toggleSong(nextSongs[0])
      });

    } else {
      this.props.actions.toggleSong(this.props.filteredPosts[nextIndex]);
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

          <MainPlayer {...this.props} onProgressUpdate={this.handleProgressUpdate} />
          {
            !!this.props.activeSong && !!this.props.activeSong.id &&
            <SongPlayerBank
              heroSongs={this.props.heroPosts}
              initialSongList={this.props.filteredPosts}
              initialActiveSong={this.props.activeSong}
              setSongDuration={this.props.actions.playerLoaded}
              setActiveSongProgress={this.props.actions.setSongProgress}
              onSongEnd={this.changeSongOnEnd}
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
    actions: bindActionCreators(BindActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatch)(AppContainer))
