import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlBar from './control-bar';
import FullView from './views/full-view';
// import ListView from './views/list-view';

import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW
} from 'constants/discover-views';

export default class Discover extends Component {

  static propTypes = {
    scroll: PropTypes.object.isRequired,
    layoutType: PropTypes.string.isRequired, // TODO use state
    songPosts: PropTypes.object.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired,
    loadMoreSongs: PropTypes.func.isRequired,
    resetSongs: PropTypes.func.isRequired,
    isLoadingMoreSongs: PropTypes.bool.isRequired, // TODO use state in layouts
    updateSpotlightSong: PropTypes.func.isRequired,
    updateDiscoverLayoutType: PropTypes.func.isRequired, // TODO use state
    availableGenres: PropTypes.object.isRequired,
    activeGenreFilters: PropTypes.object.isRequired
  }

  /* TODO find better scroll anchoring solution
   * Bonus points for including this other scroll handling!

  constructor(props) {
    super(props)
    this.state = {
      isControlBarFixed: false,
      disableScroll: true
    }
    this.mainContainerRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.enableDiscoverScroll);
    window.addEventListener('resize', this.enableDiscoverScroll);
    clearAllBodyScrollLocks();
    //this.updateScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.enableDiscoverScroll);
    window.removeEventListener('resize', this.enableDiscoverScroll);
    clearAllBodyScrollLocks();

  }

  componentDidUpdate = () => this.updateScroll();

  updateScroll = () => {
    const discoveryContainer = document.getElementById('discovery-container');
    if (!!discoveryContainer)
      discoveryContainer.scrollTop = this.props.discoverScrollPos;
  }

  updateFixedControlBarFlag = () => {
    const heroElement = document.getElementById('hero-post');
    const headerElement = document.getElementById('header');

    if (!!heroElement && !!headerElement) {
      const scrollHeight = heroElement.clientHeight + headerElement.clientHeight - 50
      const isControlBarFixed = window.scrollY > scrollHeight

      this.setState({ isControlBarFixed })
    }
  }

  enableDiscoverScroll = () => {
    const scrollHeight = document.getElementById('hero-post').clientHeight;
    if (window.scrollY > scrollHeight)
      this.setState({ disableScroll: false })
    else
      this.setState({ disableScroll: true })
  }

  scrollToDiscover = () => this.mainContainerRef.current.scrollIntoView(true);
  */

  getDiscoverSongView = () => {
    if (this.props.layoutType == FULL_VIEW)
      <FullView
        songPosts={this.props.songPosts.filtered}
        songPlayStatusForSong={this.props.songPlayStatusForSong}
        songPlayerFunctionsForSong={this.props.songPlayerFunctionsForSong}
        updateSpotlightSong={this.props.updateSpotlightSong}
        loadMoreSongs={this.props.loadMoreSongs}
        isLoadingSongs={this.props.isLoadingSongs}
      />
    else if (this.props.layoutType == SNAPSHOT_LIST_VIEW)
      <SnapshotListView />
    else if (this.props.layoutType == GRID_LIST_VIEW)
      <GridListView />

    console.log(`Could not recognize layout type ${this.props.layoutType}`)
    return null;
  }

  render = () => (
      <div className="discover">

        <ControlBar
          scroll={this.props.scroll}
          discoverLayoutType={this.props.layoutType}
          areSongsShuffled={this.props.songPosts.areShuffled}
          resetSongs={this.props.resetSongs}
          updateDiscoverLayoutType={this.props.updateDiscoverLayoutType}
          availableGenres={this.props.availableGenres}
          activeGenreFilters={this.props.activeGenreFilters}
        />

        <div
          className={
            'discover-songs' +
            (!this.props.scroll.scrolledToDiscover ? ' disableScroll' : '')
          }
        >
          { this.getDiscoverSongView() }
        </div>
      </div>
  )
}
