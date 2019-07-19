import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { songDataShape, genresShape } from 'constants/prop-shapes';

import ControlBar from './control-bar';
import FullView from './views/full-view';
import SnapshotListView from './views/snapshot-list-view';
import GridListView from './views/grid-list-view';

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
    songData: PropTypes.exact(songDataShape).isRequired,
    songPlayers: PropTypes.func.isRequired,
    genres: PropTypes.exact(genresShape).isRequired
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
        songData={this.props.songData}
        songPlayers={this.props.songPlayers}
        disableScroll={!this.props.scroll.scrolledToDiscover}
      />
    else if (this.state.layoutType === SNAPSHOT_LIST_VIEW)
      return <SnapshotListView
        songData={this.props.songData}
        songPlayers={this.props.songPlayers}
      />
    else if (this.state.layoutType === GRID_LIST_VIEW)
      return <GridListView
        songData={this.props.songData}
        songPlayers={this.props.songPlayers}
      />

    console.log(`Could not recognize layout type ${this.state.layoutType}`)
    return null;
  }

  render = () => (
      <div className="discover">

        <ControlBar
          scroll={this.props.scroll}
          discoverLayoutType={this.state.layoutType}
          updateDiscoverLayoutType={this.updateLayoutType}
          areSongsShuffled={this.props.songData.areShuffled}
          resetSongs={this.props.songData.resetSongs}
          genres={this.props.genres}
        />

        <div className="discover-songs">
          { this.getDiscoverSongView() }
        </div>

        <style jsx>{`
          .discover {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            height: calc(100vh - 75px - 75px);   // full screen height minus header + footer
            overflow: hidden;
          }
          .discover-songs {
            height: calc(100% - 55px);    // full discover height minus control bar
            overflow: hidden;
          }
        `}</style>
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
