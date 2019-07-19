import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { songDataShape, songPlayerShape } from 'constants/prop-shapes';

import Desktop from './desktop';
import Mobile from './mobile';

export const propTypes = {
  songData: PropTypes.exact(songDataShape).isRequired,
  songPlayers: PropTypes.objectOf(PropTypes.exact(songPlayerShape)).isRequired,
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
