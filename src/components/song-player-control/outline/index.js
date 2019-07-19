import React from 'react'
import PropTypes from 'prop-types';

import { propTypes, getVisibleButton } from '../shared';
import PauseButton from './pause';
import LoadingButton from './loading';
import PlayButton from './play';

export default class OutlineSongPlayerControl extends React.Component {

  static propTypes = {
    ...propTypes,
    isWhite: PropTypes.bool,
  }

  render = () => (
    <div className="outline-single-song-controls">
      {getVisibleButton(
        this.props,
        PauseButton,
        LoadingButton,
        PlayButton
      )}
    </div>
  )
}
