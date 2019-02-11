import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { resetSongs } from 'actions/fetch/songs';
import { FULL_VIEW, SNAPSHOT_LIST_VIEW, GRID_LIST_VIEW } from 'constants/discover-views';

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

import './control-bar.scss'

/* eslint-disable */

const propTypes = {
  isControlBarFixed: PropTypes.bool.isRequired,
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

    // TODO pass child a function to close itself instead of this ref bullshit
    this.genreFilterModalRef = React.createRef();
    this.viewsDropdownRef = React.createRef();
  }

  showGenreFilters = () =>
    this.setState(
      { isGenreFiltersActive: true },
      () => document.addEventListener('click', this.handleClickOffGenreFilterModal)
    );

  hideGenreFilters = () =>
    this.setState(
      { isGenreFiltersActive: false },
      () => document.removeEventListener('click', this.handleClickOffGenreFilterModal)
    );

  handleClickOffGenreFilterModal = event =>
    this.genreFilterModalRef.current &&
    !this.genreFilterModalRef.current.contains(event.target) &&
    hideGenreFilters();


  showViewsDropdown = event =>
    this.setState(
      { isViewsDropdownActive: true },
      () => document.addEventListener('click', this.handleClickOffViewsDropdown)
    );

  hideViewsDropdown = () =>
    this.setState(
      { isViewsDropdownActive: false },
      () => document.removeEventListener('click', this.handleClickOffViewsDropdown)
    );

  handleClickOffViewsDropdown = event =>
    this.viewsDropdownRef.current &&
    !this.viewsDropdownRef.current.contains(event.target) &&
    hideViewsDropdown();

  changeGridView = event => {
    hideViewsDropdown();
    this.props.changeGridView(e.target.name);
  }

  getActiveViewIcon = () => {
    switch(this.props.discoverView) {
      case FULL_VIEW:
        return <FullViewIcon width="24" height="24" />;
        break;
      case SNAPSHOT_LIST_VIEW:
        return <SnapshotViewIcon width="24" height="24" />;
        break;
      case GRID_LIST_VIEW:
        return <GridViewIcon width="24" height="24" />;
        break;
      default: null
    }
  }

  getActiveViewName = () => {
    switch(this.props.discoverView) {
      case FULL_VIEW:
        return 'Full View';
      case SNAPSHOT_LIST_VIEW:
        return 'Snapshot View';
      case GRID_LIST_VIEW:
        return 'Grid View';
      default: null
    }
  }


  getFixedControlBarClass = () =>
    this.props.isControlBarFixed ? 'fixed-control-bar' : '';

  render() {
    return (
        <div className={`control-bar ${this.getFixedControlBarClass}`}>

          <div className="control-bar-items">
            <div
              className={
                'control-bar-item ' +
                'shuffle ' +
                this.props.isShuffle ? 'highlighted' : ''
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
                this.state.isViewsDropdownActive ? 'selected' : ''
              }
              onClick={() => this.showViewsDropdown()}
            >
              <span className="control-bar-icon">{ this.getActiveViewIcon }</span>
              <span className="control-bar-title mobile">{ this.getActiveViewName }</span>
              <span className="control-bar-title desktop">{ this.getActiveViewName }</span>
            </div>

            <div
              className={
                'control-bar-item ' +
                'genre-filter ' +
                this.state.isGenreFiltersActive ? 'selected' : ''
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

          <div className="control-bar-content">
            <ViewsDropdown />
            <GenreFilters />
          </div>

        </div>
    )
  }
}

export default connect(
  ({ isShuffle }) => ({ isShuffle }),
  { resetSongs }
)(ControlBar)
