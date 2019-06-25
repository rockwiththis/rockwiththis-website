import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { resetSongs } from 'actions/fetch/songs';
import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW
} from 'constants/discover-views';

import ViewsDropdown from './views-dropdown/index.js';
import GenreFilters from './genre-filters/index.js';
import Moments from './moments/index.js';

import FullViewIcon from 'components/icons/full-view';
import SnapshotViewIcon from 'components/icons/snapshot-view';
import GridViewIcon from 'components/icons/grid-view';
import {
  TiArrowShuffle as ShuffleIcon,
  TiTags as GenreIcon,
  TiTime as MomentIcon
} from 'react-icons/ti';

/* TODO handle scroll
 * Toggle filter modal -> scroll main to discovery
 * Update songs -> scroll to top of discovery
 */

class ControlBar extends Component {

  static propTypes = {
    scroll: PropTypes.object.isRequired,

    // Redux
    discoverLayout: PropTypes.string.isRequired,
    isShuffle: PropTypes.bool.isRequired,
    resetSongs: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isGenreFiltersActive: false,
      isViewsDropdownActive: false,
      isMomentsActive: false,
    }
  }

  showGenreFilters = () => {
    this.props.scroll.scrollToDiscover();
    this.props.scroll.setIsScrollDisabled(true);
    this.setState({ isGenreFiltersActive: true });
  }

  hideGenreFilters = () => {
    this.props.scroll.setIsScrollDisabled(false);
    this.setState({ isGenreFiltersActive: false });
  }

  showViewsDropdown = event =>
    this.setState({ isViewsDropdownActive: true });

  hideViewsDropdown = () =>
    this.setState({ isViewsDropdownActive: false });

  showMoments = event =>
    this.setState({ isMomentsActive: true });

  hideMoments = () =>
    this.setState({ isMomentsActive: false });

  getActiveViewIcon = () => {
    switch(this.props.discoverLayout) {
      case FULL_VIEW:
        return <FullViewIcon  />;
      case SNAPSHOT_LIST_VIEW:
        return <SnapshotViewIcon  />;
      case GRID_LIST_VIEW:
        return <GridViewIcon />;
      default: null
    }
  }

  getActiveViewName = () => {
    switch(this.props.discoverLayout) {
      case FULL_VIEW:
        return 'Full';
      case SNAPSHOT_LIST_VIEW:
        return 'Snap';
      case GRID_LIST_VIEW:
        return 'Grid';
      default: null
    }
  }

  render = () => (
      <div>
        <div
          className={
            'control-bar' +
            (this.props.scroll.scrolledToDiscover ? ' fixed-control-bar' : '')
          }
        >
          <div
            className={
              'control-bar-item' +
              ' view' +
              (this.state.isViewsDropdownActive ? ' active' : '')
            }
            onClick={() => this.showViewsDropdown()}
          >
            <span className="control-bar-icon">{ this.getActiveViewIcon() }</span>
            <span className="control-bar-title mobile">{ this.getActiveViewName() } View</span>
            <span className="control-bar-title desktop">{ `${this.getActiveViewName()} View` }</span>
          </div>

          <div className="control-bar-separator"></div>

          <div
            className={
              'control-bar-item' +
              ' shuffle' +
              (this.props.isShuffle ? ' active' : '')
            }
            onClick={() => this.props.resetSongs({ isShuffle: !this.props.isShuffle })}
          >
            <span className="control-bar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2 7h-2v-2h2c3.49 0 5.48 1.221 6.822 2.854-.41.654-.754 1.312-1.055 1.939-1.087-1.643-2.633-2.793-5.767-2.793zm16 10c-3.084 0-4.604-1.147-5.679-2.786-.302.627-.647 1.284-1.06 1.937 1.327 1.629 3.291 2.849 6.739 2.849v3l6-4-6-4v3zm0-10v3l6-4-6-4v3c-5.834 0-7.436 3.482-8.85 6.556-1.343 2.921-2.504 5.444-7.15 5.444h-2v2h2c5.928 0 7.543-3.511 8.968-6.609 1.331-2.893 2.479-5.391 7.032-5.391z"/></svg>
            </span>
            <span className="control-bar-title shuffle">Shuffle</span>
          </div>

          <div className="control-bar-separator"></div>

          <div
            className={
              'control-bar-item ' +
              'genre-filter ' +
              (this.state.isGenreFiltersActive ? 'active' : '')
            }
            onClick={() => this.showGenreFilters()}
          >
            <span className="control-bar-icon">
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 24"><path d="M6,24l3-9H0L14,0,11,9h9Z"/></svg>
            </span>
            <span className="control-bar-title">Subgenres</span>
          </div>

          <div
            className={
              'control-bar-item' +
              ' moments' +
              (this.state.isMomentsActive ? ' active' : '')
            }
            onClick={() => this.showMoments()}
          >
            <span className="control-bar-icon">
              <svg viewBox="0 0 17 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.06758333,13.0738793 C5.39820833,14.877931 3.46233333,16.0137069 1.41879167,16.1228879 C1.51725,14.091681 2.611625,12.0135776 4.40016667,11.3137931 L4.76141667,11.6955603 C3.67483333,12.8115517 3.30154167,13.7216379 3.24275,14.2316379 C3.74141667,14.1693534 4.66366667,13.7861207 5.709875,12.6957759 L6.06758333,13.0738793 Z M5.26291667,4.76293103 C4.0035,4.75560345 2.38566667,5.43047414 1.17866667,6.67836207 C0.71825,7.15392241 0.313083333,7.71008621 0,8.33293103 C1.08941667,7.48073276 2.2865,7.24478448 3.64579167,8.03396552 C4.04670833,6.93922414 4.58079167,5.82543103 5.26291667,4.76293103 Z M8.94908333,17.5862069 C9.55258333,17.2637931 10.0895,16.8439224 10.550625,16.3668966 C11.7604583,15.1168103 12.407875,13.4351293 12.395125,12.1300862 C11.2795,12.8848276 10.1815833,13.4285345 9.23170833,13.8125 C9.99458333,15.2193966 9.772875,16.4606897 8.94908333,17.5862069 Z M16.96175,0.0322413793 C16.6585833,0.0102586207 16.3610833,0 16.0685417,0 C9.454125,0 5.8225,5.44146552 4.66366667,9.5324569 L7.80016667,12.7771121 C11.8943333,11.4178448 17,7.8112069 17,1.05810345 L17,1.01487069 C16.9985833,0.694655172 16.9865417,0.367112069 16.96175,0.0322413793 Z M12.75,5.86206897 C11.9672917,5.86206897 11.3333333,5.20625 11.3333333,4.39655172 C11.3333333,3.58685345 11.9672917,2.93103448 12.75,2.93103448 C13.5327083,2.93103448 14.1666667,3.58685345 14.1666667,4.39655172 C14.1666667,5.20625 13.5327083,5.86206897 12.75,5.86206897 Z" id="Shape"></path>
              </svg>
            </span>
            <span className="control-bar-title">Moments</span>
          </div>

        </div>

        <div
          className={
            'control-bar-controls' +
            (this.props.scroll.isScrolledToDiscover ? ' fixed-controls-bar' : '')
          }
        >
          <ViewsDropdown
            isActive={this.state.isViewsDropdownActive}
            activeView={this.props.discoverLayout}
            hide={this.hideViewsDropdown}
          />
          <GenreFilters
            isActive={this.state.isGenreFiltersActive}
            hide={this.hideGenreFilters}
          />
          <Moments
            isActive={this.state.isMomentsActive}
            hide={this.hideMoments}
          />
        </div>

        <style jsx>{`
          .control-bar {
            height: 55px;
            background-color: #f5f3f3;
            border-top: 2px solid #e3e3e3;
            border-bottom: 2px solid #e3e3e3;
            box-sizing: border-box;
            padding: 0 15px;
            padding-top: 8px;
          }
          .control-bar-item {
            display: inline-block;
            margin-right: 10px;
            border: 1px solid #545454;
            border-radius: 8px;
            padding: 6px;
            text-align: center;
            cursor: pointer;
            color: #545454;
          }
          .control-bar-separator {
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
            border-left: 1px solid #545454;
            height: 25px;
          }
          .control-bar-icon {
            height: 20px;
            vertical-align: middle;
            display: inline-block;
          }
          .control-bar-title {
            vertical-align: middle;
            margin-left: 5px;
          }
          .control-bar-controls {
            position: absolute;
          }
          // Desktop only
          @media (min-width: 800px) {
            .control-bar-title.mobile {
              display: none;
            }
            .control-bar-item.shuffle {
              border-radius: 50%;
              border: 2px solid #545454;
            }
            .control-bar-title.shuffle {
              display: none;
            }
          }
        `}</style>
        <style global jsx>{`
          .control-bar-icon svg {
            height: 20px;
            width: 20px;
            vertical-align: middle;
            fill: #545454;
          }
        `}</style>
      </div>
  )
}

export default connect(
  ({ discoverLayout, isShuffle }) => ({ discoverLayout, isShuffle }),
  { resetSongs }
)(ControlBar)
