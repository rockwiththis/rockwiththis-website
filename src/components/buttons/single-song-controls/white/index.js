import React from 'react'
import PropTypes from 'prop-types';

import { propTypes, getVisibleButton } from '../shared';
import WhitePauseButton from './pause';
import WhiteLoadingButton from './loading';
import WhitePlayButton from './play';

class WhiteSingleSongControls extends React.Component {
  render = () => (
    <div className="white-single-song-controls">
      {getVisibleButton(
        this.props,
        WhitePauseButton,
        WhiteLoadingButton,
        WhitePlayButton
      )}
    </div>
  )
}

WhiteSingleSongControls.propTypes = propTypes;

export default WhiteSingleSongControls;
