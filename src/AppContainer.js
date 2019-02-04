import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { fetchFilters } from 'actions/filters'
import * as Actions from 'actions/index'
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
    this.playerContainerRef = React.createRef();
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
      this.playerBankRef.current.setSongListPlayers(
        [
          ...this.props.songListPosts,
          this.props.snapshotPost,
          this.props.singleSong
        ],
      );
      this.props.activeSong && this.playerBankRef.current.ensureActivePlayer(this.props.activeSong);
      this.props.actions.playerBankUpdated();
    }

    if (this.props.location.pathname === '/' && prevProps.location.pathname !== '/')
      this.resetScroll();
  };

  // TODO this won't work on some browsers b/c of video autoplay constraints. Handle this case.
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

  resetScroll = () => {
    window.scrollTo(0, this.mainPageScroll);

    const discoveryContainer = document.getElementById('discovery-container');
    if (!!discoveryContainer) discoveryContainer.scrollTop = this.discoveryScroll;
  }

  setMainPageScroll = newScrollPos => this.mainPageScroll = newScrollPos;

  setDiscoveryScroll = newScrollPos => this.discoveryScroll = newScrollPos;

  render() {
    return (
        <div>
          <Header {...this.props} shrinkHeader={this.state.shrinkHeader} />

          {
            React.cloneElement(
                this.props.children,
                {
                  ...this.props,
                  setMainPageScroll: this.setMainPageScroll,
                  setDiscoveryScroll: this.setDiscoveryScroll
                }
            )
          }

          <MainPlayer {...this.props} onProgressUpdate={this.handleProgressUpdate}/>
          {
            !!this.props.activeSong && !!this.props.activeSong.id &&
            <SongPlayerBank
              heroSongs={this.props.heroPosts}
              initialSongList={this.props.songListPosts}
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
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatch)(AppContainer))
