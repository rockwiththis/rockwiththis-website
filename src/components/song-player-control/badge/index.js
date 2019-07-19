import React from 'react'
import PropTypes from 'prop-types';

import { propTypes, getVisibleButton } from '../shared';
import BadgePauseButton from './pause';
import BadgeLoadingButton from './loading';
import BadgePlayButton from './play';

export default class BadgeSongPlayerControl extends React.Component {

  static propTypes = propTypes

  render = () => (
    <div className="song-player-control">
      {getVisibleButton(
        this.props,
        BadgePauseButton,
        BadgeLoadingButton,
        BadgePlayButton
      )}

      <style jsx global>{`
        .song-player-control img, .song-player-control svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
