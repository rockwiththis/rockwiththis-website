import React from 'react'
import PropTypes from 'prop-types';

import blackLoadingButton from 'images/Loading_Icon_2_5.gif';
import whiteLoadingButton from 'images/Rolling-1.6s-200px.gif';

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
