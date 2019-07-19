import React from 'react';

const loadingButtonImage = '/static/images/play-loading.gif';

class BadgeLoadingButton extends React.Component {
  render = () =>
    <img src={loadingButtonImage} className="loadingButton" />;
}

export default BadgeLoadingButton;
