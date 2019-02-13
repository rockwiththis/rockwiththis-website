import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { resetSongs } from 'actions/fetch/songs';
import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW
} from 'constants/discover-views';

import ViewsDropdown from './views-dropdown';
import GenreFilters from './genre-filters';

import FullViewIcon from 'components/icons/full-view';
import SnapshotViewIcon from 'components/icons/snapshot-view';
import GridViewIcon from 'components/icons/grid-view';
import {
  TiArrowShuffle as ShuffleIcon,
  TiTags as GenreIcon,
  TiTime as MomentIcon
} from 'react-icons/ti';

import './stylesheets/control-bar.scss'

/* eslint-disable */

const propTypes = {
  isControlBarFixed: PropTypes.bool.isRequired,
  scrollToDiscover: PropTypes.func.isRequired,

  // Redux
  discoverLayout: PropTypes.string.isRequired,
  isShuffle: PropTypes.bool.isRequired,
  resetSongs: PropTypes.func.isRequired
}

/* TODO handle scroll
 * Toggle filter modal -> scroll main to discovery
 * Update songs -> scroll to top of discovery
 */

class ControlBar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isGenreFiltersActive: false,
      isViewsDropdownActive: false,
    }
  }

  disableScrolling = () => {
    const x = window.scrollX;
    const y = window.scrollY;
    window.onscroll= () => window.scrollTo(x, y);
  }

  enableScrolling = () => window.onscroll = () => {}

  showGenreFilters = () => {
    this.props.scrollToDiscover();
    this.disableScrolling();
    this.setState({ isGenreFiltersActive: true });
  }

  hideGenreFilters = () => {
    this.enableScrolling();
    this.setState({ isGenreFiltersActive: false });
  }

  showViewsDropdown = event =>
    this.setState({ isViewsDropdownActive: true });

  hideViewsDropdown = () =>
    this.setState({ isViewsDropdownActive: false });

  getActiveViewIcon = () => {
    switch(this.props.discoverLayout) {
      case FULL_VIEW:
        return <FullViewIcon width="16" height="16" />;
      case SNAPSHOT_LIST_VIEW:
        return <SnapshotViewIcon width="16" height="16" />;
      case GRID_LIST_VIEW:
        return <GridViewIcon width="16" height="16" />;
      default: null
    }
  }

  getActiveViewName = () => {
    switch(this.props.discoverLayout) {
      case FULL_VIEW:
        return 'Full';
      case SNAPSHOT_LIST_VIEW:
        return 'Snapshot';
      case GRID_LIST_VIEW:
        return 'Grid';
      default: null
    }
  }

  getFixedControlBarClass = () =>
    this.props.isControlBarFixed ? 'fixed-control-bar' : '';

  render() {
    return (
        <div className="control-wrapper">

          <div className={`control-bar ${this.getFixedControlBarClass}`}>
            <div
              className={
                'control-bar-item ' +
                'shuffle ' +
                (this.props.isShuffle ? 'active' : '')
              }
              onClick={() => this.props.resetSongs({ isShuffle: !this.props.isShuffle })}
            >
              <span className="control-bar-icon"><ShuffleIcon /></span>
              <span className="control-bar-title">Shuffle</span>
            </div>

            <div
              className={
                'control-bar-item ' +
                'view ' +
                (this.state.isViewsDropdownActive ? 'active' : '')
              }
              onClick={() => this.showViewsDropdown()}
            >
              <span className="control-bar-icon">{ this.getActiveViewIcon() }</span>
              <span className="control-bar-title mobile">{ this.getActiveViewName() }</span>
              <span className="control-bar-title desktop">{ `${this.getActiveViewName()} View` }</span>
            </div>

            <div
              className={
                'control-bar-item ' +
                'genre-filter ' +
                (this.state.isGenreFiltersActive ? 'active' : '')
              }
              onClick={() => this.showGenreFilters()}
            >
              <span className="control-bar-icon"><GenreIcon /></span>
              <span className="control-bar-title">Subgenres</span>
            </div>

            <div className="control-bar-item moments">
              <span className="control-bar-icon"><MomentIcon /></span>
              <span className="control-bar-title">Moments</span>
            </div>
          </div>

          <div className="controls">
            <ViewsDropdown
              isActive={this.state.isViewsDropdownActive}
              activeView={this.props.discoverLayout}
              hide={this.hideViewsDropdown}
            />
            <GenreFilters
              isActive={this.state.isGenreFiltersActive}
              hide={this.hideGenreFilters}
            />
          </div>
        </div>
    )
  }
}

export default connect(
  ({ discoverLayout, isShuffle }) => ({ discoverLayout, isShuffle }),
  { resetSongs }
)(ControlBar)
