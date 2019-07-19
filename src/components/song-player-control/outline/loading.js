import React from 'react'
import PropTypes from 'prop-types';

const blackLoadingButtonImage = '/static/images/Loading_Icon_2_5.gif';
const whiteLoadingButtonImage = '/static/images/Rolling-1.6s-200px.gif';

class OutlineLoadingButton extends React.Component {

  static propTypes = {
    isWhite: PropTypes.bool
  }

  render = () => (
    <img
      className="loadingButton"
      src={this.props.isWhite ? whiteLoadingButtonImage : blackLoadingButtonImage}
    />
  )
}

export default OutlineLoadingButton;
