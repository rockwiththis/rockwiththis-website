import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Desktop from './desktop';
import Mobile from './mobile';

export const propTypes = {
  songPosts: PropTypes.object.isRequired,
  songPlayStatusForSong: PropTypes.func.isRequired,
  songPlayerFunctionsForSong: PropTypes.func.isRequired,
  songDataFunctions: PropTypes.object.isRequired,
  disableScroll: PropTypes.bool
}

export default class FullView extends Component {

  static propTypes = propTypes

  render = () => (
      <div className="full-view">
        <Desktop {...this.props} />
        <Mobile {...this.props} />

        <style jsx>{`
          height: 100%;
        `}</style>
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
