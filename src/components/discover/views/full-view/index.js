import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Desktop from './desktop';
import Mobile from './mobile';
import SongGridPlaceholder from './SongGridPlaceholder';
import FullSongPlaceholder from './FullSongPlaceholder';

export const propTypes = {
  songPosts: PropTypes.object.isRequired,
  songPlayStatusForSong: PropTypes.func.isRequired,
  songPlayerFunctionsForSong: PropTypes.func.isRequired,
  songDataFunctions: PropTypes.object.isRequired
}

export default class FullView extends Component {

  static propTypes = propTypes

  // TODO adjust placeholder
  render = () => (
      <div className="full-view">
        {this.props.songPosts.filtered.length > 0 ?
          <Fragment>
            <Desktop {...this.props} />
            <Mobile {...this.props} />
          </Fragment>
          :
          <Fragment>
            <div className="full-view">
              <div className="song-grid-container">
                <SongGridPlaceholder />
              </div>
              <div className="discover-full-song-container">
                <FullSongPlaceholder />
              </div>
            </div>
          </Fragment>
        }

        <style jsx global>{`
          @media (min-width: 800px) {
            .full-view .full-view-mobile {
              display: none
            }
          }
          @media (max-width: 800px) {
            .full-view .full-view-desktop {
              display: none
            }
          }
        `}</style>
      </div>
  )
}
