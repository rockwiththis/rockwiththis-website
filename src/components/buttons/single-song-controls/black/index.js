import React from 'react'
import PropTypes from 'prop-types';

import { propTypes, getVisibleButton } from '../shared';
import BlackPauseButton from './pause';
import BlackLoadingButton from './loading';
import BlackPlayButton from './play';

export class BlackSingleSongControls extends React.Component {
  render = () => (
    getVisibleButton(
      this.props,
      BlackPauseButton,
      BlackLoadingButton,
      BlackPlayButton
    )
  )
}
BlackSingleSongControls.propTypes = propTypes;

export default BlackSingleSongControls;
