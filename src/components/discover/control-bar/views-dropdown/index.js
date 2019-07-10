import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  FULL_VIEW,
  SNAPSHOT_LIST_VIEW,
  GRID_LIST_VIEW
} from 'constants/discover-views';

import FullViewIcon from 'components/icons/full-view';
import SnapshotViewIcon from 'components/icons/snapshot-view';
import GridViewIcon from 'components/icons/grid-view';

export default class ViewsDropdown extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    activeView: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    updateDiscoverLayoutType: PropTypes.func.isRequired
  }

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.props.hide);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.props.hide);
  }

  render = () => (
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
          onClick={() => this.props.updateDiscoverLayoutType(FULL_VIEW)}
        >
          <div className="view-select-item-content">
            <FullViewIcon />
            <span>Full View</span>
          </div>
        </div>

        <div
          className={
            'view-select-item' +
            (this.props.activeView === SNAPSHOT_LIST_VIEW ? ' active' : '')
          }
          onClick={() => this.props.updateDiscoverLayoutType(SNAPSHOT_LIST_VIEW)}
        >
          <div className="view-select-item-content">
            <SnapshotViewIcon />
            <span>Snap View</span>
          </div>
        </div>

        <div
          className={
            'view-select-item' +
            (this.props.activeView === GRID_LIST_VIEW ? ' active' : '')
          }
          onClick={() => this.props.updateDiscoverLayoutType(GRID_LIST_VIEW)}
        >
          <div className="view-select-item-content">
            <GridViewIcon />
            <span>Grid View</span>
          </div>
        </div>

        <style jsx>{`
          .views-dropdown {
            position: absolute;
            z-index: 10;
            width: 120px;
            border: 2px solid #282828;
            border-top: 0;
            border-bottom-right-radius: 4px;
            border-bottom-left-radius: 4px;
            background-color: #f5f3f3;
            margin-left: 10px;
            cursor: pointer;
          }
          .views-dropdown.hidden {
            display: none;
          }
          .view-select-item {
            padding: 10px;
            border-bottom: 1px solid #ccc;
            box-sizing: border-box;
          }
          .view-select-item-content {
            font-size: 9pt;
          }
          @media (max-width: 800px) {
            .views-dropdown {
              width: 100%;
              margin: 0;
              border: 0;
              box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);
              height: 45px;
            }
            .view-select-item {
              display: inline-block;
              width: 33.3%;
              height: 100%;
              position: relative;
              padding: 0;
            }
            .view-select-item-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .view-select-item-content span {
              display: block;
              font-size: 7.5pt;
              padding-top: 2px;
            }
          }
        `}</style>
        <style global jsx>{`
          .views-dropdown svg {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 10px;
          }
          @media (max-width: 800px) {
            .views-dropdown svg {
              display: block;
              width: 16px;
              height: 16px;
              margin: 0 auto;
            }
          }
        `}</style>
      </div>
  )
}
