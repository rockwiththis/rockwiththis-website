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
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentWillMount() {
    this.props.actions.fetchFilters()
    console.log("this.props.actions.fetchFilters()");
    console.log(this.props.actions.fetchFilters());
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

  getAllPlayableSongs = () => (
      [
        ...this.props.heroPosts,
        this.props.activeSong,
        this.props.snapshotPost,
        ...this.props.songListPosts,
      ]
      .filter(song => !!song.id)
  );

  changeSongOnEnd = () => {
    const nextIndex = this.props.filteredPosts.findIndex(this.isCurrentSong) + 1
    const nextQueuePosition = nextIndex >= this.props.filteredPosts.length ? 0 : nextIndex
    this.props.actions.toggleSong(this.props.filteredPosts[nextQueuePosition])
  }

  render() {
    return (
        <div>
          <Header {...this.props} shrinkHeader={this.state.shrinkHeader} />
          <SocialLinks />

          {React.cloneElement(this.props.children, { ...this.props })}

          <MainPlayer {...this.props} />
          <SongPlayerContainer
            songPosts={this.getAllPlayableSongs()}
            currentSongId={this.props.activeSong.id}
            isPlaying={this.props.isPlaying}
            onSongProgress={this.props.actions.setSongProgress}
            onSongEnd={this.changeSongOnEnd}
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
