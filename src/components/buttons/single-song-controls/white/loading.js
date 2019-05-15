import React from 'react'

import loadingButton from 'images/Loading_Icon_2_5.gif';

class WhiteLoadingButton extends React.Component {
  render = () =>
    <img src={loadingButton} className="loadingButton" />;
}

export default WhiteLoadingButton;
