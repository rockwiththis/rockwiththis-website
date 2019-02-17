import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { updateDiscoverLayout } from 'actions/set-state';

import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW
} from 'constants/discover-views';

import FullViewIcon from 'components/icons/full-view';
import SnapshotViewIcon from 'components/icons/snapshot-view';
import GridViewIcon from 'components/icons/grid-view';

import './stylesheets/views-dropdown.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  activeView: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,

  // Redux
  updateDiscoverLayout: PropTypes.func.isRequired
}

class ViewsDropdown extends Component {

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.props.hide);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.props.hide);
  }

  render() {
    return (
        <div
          className={
            'views-dropdown' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
          <div
            className={
              'view-select-item' +
              (this.props.activeView === FULL_VIEW ? ' active' : '')
            }
            onClick={() => this.props.updateDiscoverLayout(FULL_VIEW)}
          >
            <FullViewIcon />
            <span>Full</span>
          </div>

          <div
            className={
              'view-select-item' +
              (this.props.activeView === SNAPSHOT_LIST_VIEW ? ' active' : '')
            }
            onClick={() => this.props.updateDiscoverLayout(SNAPSHOT_LIST_VIEW)}
          >
            <SnapshotViewIcon />
            <span>Snapshot</span>
          </div>

          <div
            className={
              'view-select-item' +
              (this.props.activeView === GRID_LIST_VIEW ? ' active' : '')
            }
            onClick={() => this.props.updateDiscoverLayout(GRID_LIST_VIEW)}
          >
            <GridViewIcon />
            <span>Grid</span>
          </div>
        </div>
    )
  }
}

ViewsDropdown.propTypes = propTypes;

export default connect(null, { updateDiscoverLayout })(ViewsDropdown);
