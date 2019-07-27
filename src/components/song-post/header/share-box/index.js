import React, { Component } from 'react'
import PropTypes from 'prop-types';

import ShareBoxInfo from './info';
import ShareBoxLinks from './links';
import ShareBoxCopyLink from './copy-link';

export default class ShareBox extends Component {

  static propTypes = {
    song: PropTypes.object.isRequired,
    isShowing: PropTypes.bool,
    closePopup: PropTypes.func.isRequired
  }

  render = () => {
    const songUrl = `http://rockwiththis.com/songs/${this.props.song.id}`;
    if (!this.props.isShowing) return false

    return (
      <div className="share-box">
        <ShareBoxInfo
          song={this.props.song}
          closePopup={this.props.closePopup}
        />
        <ShareBoxLinks songUrl={songUrl} />
        <ShareBoxCopyLink songUrl={songUrl} />

        <style jsx>{`
          .share-box {
            position: absolute;
            top: 90px;
            left: 20%;
            max-width: 500px;
            min-width: 350px;
            width: 40vw;
            padding: 15px;
            box-sizing: border-box;
            box-shadow: 0 3px 2px -2px #C9C6CB;
            border: 1px solid #C9C6CB;
            background-color: white;
            letter-spacing: .5px;
            z-index: 2;
          }
        `}</style>
      </div>
    );
  }
}
