import React from 'react';

import loadingButton from 'images/play-loading.gif';

class BadgeLoadingButton extends React.Component {
  render = () =>
    <img src={loadingButton} className="loadingButton" />;
}

export default BadgeLoadingButton;
