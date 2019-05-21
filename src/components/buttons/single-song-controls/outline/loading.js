import React from 'react'
import PropTypes from 'prop-types';

import blackLoadingButton from 'images/Loading_Icon_2_5.gif';
// TODO replace me
import whiteLoadingButton from 'images/Loading_Icon_2_5.gif';

class OutlineLoadingButton extends React.Component {

  static propTypes = {
    isWhite: PropTypes.bool
  }

  render = () => (
    <img
      className="loadingButton"
      src={this.props.isWhite ? whiteLoadingButton : blackLoadingButton}
    />
  )
}

export default OutlineLoadingButton;
