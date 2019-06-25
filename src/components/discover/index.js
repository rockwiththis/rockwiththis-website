import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlBar from './control-bar';
// import FullView from './views/full-view';
// import ListView from './views/list-view';

import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW
} from 'constants/discover-views';

class Discover extends Component {

  static propTypes = {
    scroll: PropTypes.object.isRequired,
    // Redux
    discoverLayout: PropTypes.string.isRequired,
  }

  // TODO tracking window scroll should really be happening in pages/Homepage instead

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

  getDiscoverSongs = () => {
    if (this.props.layoutType == FULL_VIEW)
      <FullView />
    else if (this.props.layoutType == SNAPSHOT_LIST_VIEW)
      <SnapshotListView />
    else if (this.props.layoutType == GRID_LIST_VIEW)
      <GridListView />

    console.log(`Could not recognize layout type ${this.props.layoutType}`)
    return null;
  }

  render = () => (
      <div className="discover">

        <ControlBar scroll={this.props.scroll} />

        <div
          className={
            'discover-songs' +
            (!this.props.scrolledToDiscover ? ' disableScroll' : '')
          }
        >
          { this.getDiscoverSongs() }
        </div>
      </div>
  )

  /*
  renderOther() {
    return (
        <div className="songsContainer clearfix" ref={this.mainContainerRef}>
          <div id="discover" className="discovery-section">

            <ControlBar
              isControlBarFixed={this.state.isControlBarFixed}
              scrollToDiscover={this.scrollToDiscover}
            />

            <div
              id="discovery-container"
              name="discovery-container"
              // onScroll={e => this.props.setDiscoverScroll(e.target.scrollTop)}
              className={
                'discovery-container' +
                (this.state.disableScroll ? ' disableScroll' : '') +
                (this.props.discoverLayout === 'snapshot' ? ' previewScrollLayout' : ' fullViewLayout') +
                (this.props.discoverLayout === 'fullGrid' ? ' fullGridLayout' : '')
              }
            >
              {
                this.props.discoverLayout !== 'snapshot' &&
                <FullView />
              }

              <ListView isControlBarFixed={this.state.isControlBarFixed} />
            </div>

          </div>
        </div>
    )
  }
  */
}

export default connect(
  ({ discoverLayout }) => ({ discoverLayout })
)(Discover)
