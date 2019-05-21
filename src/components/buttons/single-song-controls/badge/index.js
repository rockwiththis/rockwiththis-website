import React from 'react'
import PropTypes from 'prop-types';

import { propTypes, getVisibleButton } from '../shared';
import BadgePauseButton from './pause';
import BadgeLoadingButton from './loading';
import BadgePlayButton from './play';

export class BadgeSingleSongControls extends React.Component {

  static propTypes = propTypes

  render = () => (
    <div className="badge-single-song-controls">
      {getVisibleButton(
        this.props,
        BadgePauseButton,
        BadgeLoadingButton,
        BadgePlayButton
      )}
    </div>
  )
}

export default BadgeSingleSongControls;
