import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { fetchFilters } from 'actions/filters'
import * as Actions from 'actions/index'

import SocialLinks from 'components/SocialLinks/SocialLinks.js'
import Header from 'components/Header/Header.js'
import SongPlayerContainer from 'components/SongPlayer/SongPlayerContainer';
import MainPlayer from 'components/FooterPlayer/MainPlayer'

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { shrinkHeader: false }
    this.handleScroll = this.handleScroll.bind(this);
    this.playerContainerRef = React.createRef();
    this.props.actions.fetchFilters()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    console.log("stste");
    console.log(this.props);
  }

  handleScroll() {
    const shrinkHeader = window.scrollY > 70
    this.setState({ shrinkHeader })
  }

  componentDidUpdate(prevProps) {
      if (prevProps.activeSong.id !== this.props.activeSong.id &&
          this.props.isPlaying)
        this.playerContainerRef.current.updateSongProgress(0)
  };

  getAllPlayableSongs = () => (
      [
        ...this.props.heroPosts,
        ...this.props.songListPosts,
        this.props.activeSong,
        this.props.snapshotPost
      ]
      .filter(song => !!song.id)
  );

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
      this.playerContainerRef.current.updateSongProgress(progressRatio)
  };

  render() {
    return (
        <div>
          <Header {...this.props} shrinkHeader={this.state.shrinkHeader} />
          <SocialLinks />

          {React.cloneElement(this.props.children, { ...this.props })}

          <MainPlayer {...this.props} onProgressUpdate={this.handleProgressUpdate}/>
          <SongPlayerContainer
            songPosts={this.getAllPlayableSongs()}
            currentSongId={this.props.activeSong.id}
            isPlaying={this.props.isPlaying}
            onSongLoading={this.props.actions.loadingPlayer}
            onSongLoaded={this.props.actions.playerLoaded}
            onSongProgress={this.props.actions.setSongProgress}
            onSongEnd={this.changeSongOnEnd}
            ref={this.playerContainerRef}
          />
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
