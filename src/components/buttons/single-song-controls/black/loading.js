import React from 'react';

import loadingButton from 'images/play-loading.gif';

class BlackLoadingButton extends React.Component {
  render = () =>
    <img src={loadingButton} className="loadingButton" />;
}

export default BlackLoadingButton;
