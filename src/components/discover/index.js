import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlBar from './control-bar';
import FullView from './views/full-view';
// import ListView from './views/list-view';

import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW,
  ALL_VIEWS
} from 'constants/discover-views';

const INITIAL_LAYOUT_TYPE = FULL_VIEW;

export default class Discover extends Component {

  static propTypes = {
    scroll: PropTypes.object.isRequired,
    songPosts: PropTypes.object.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired,
    songDataFunctions: PropTypes.exact({
      loadMore: PropTypes.func.isRequired,
      resetSongs: PropTypes.func.isRequired,
      setSpotlight: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired
    }).isRequired,
    /*
    isLoadingMoreSongs: PropTypes.bool.isRequired,
    updateSpotlightSong: PropTypes.func.isRequired,
    */
    genres: PropTypes.exact({
      availableGenres: PropTypes.object.isRequired,
      activeGenreFilters: PropTypes.object.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = { layoutType: INITIAL_LAYOUT_TYPE };
  }

  updateLayoutType = newLayoutType => {
    if (ALL_VIEWS.includes(newLayoutType)) { 
      this.setState({ layoutType: newLayoutType });
    } else {
      console.log(`Requested layout type ${newLayoutType} is not recognized`);
    }
  }

  getDiscoverSongView = () => {
    if (this.state.layoutType === FULL_VIEW)
      return <FullView
        songPosts={this.props.songPosts}
        songPlayStatusForSong={this.props.songPlayStatusForSong}
        songPlayerFunctionsForSong={this.props.songPlayerFunctionsForSong}
        songDataFunctions={this.props.songDataFunctions}
      />
    else if (this.state.layoutType === SNAPSHOT_LIST_VIEW)
      return <SnapshotListView />
    else if (this.state.layoutType === GRID_LIST_VIEW)
      return <GridListView />

    console.log(`Could not recognize layout type ${this.state.layoutType}`)
    return null;
  }

  render = () => (
      <div className="discover">

        <ControlBar
          scroll={this.props.scroll}
          discoverLayoutType={this.state.layoutType}
          updateDiscoverLayoutType={this.updateLayoutType}
          areSongsShuffled={this.props.songPosts.areShuffled}
          songDataFunctions={this.props.songDataFunctions}
          genres={this.props.genres}
        />

        <div
          className={
            'discover-songs' +
            (!this.props.scroll.scrolledToDiscover ? ' disable-scroll' : '')
          }
        >
          { this.getDiscoverSongView() }
        </div>
      </div>
  )

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
}
