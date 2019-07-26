import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';

const smsImage = 'images/sms.png';

export default class ShareBoxLinks extends Component {

  static propTypes = {
    songUrl: PropTypes.string.isRequired
  }

  render = () => (
      <div className="share-box-links">

        <FacebookShareButton url={this.props.songUrl}>
          <FacebookIcon size={40} round={false} />
        </FacebookShareButton>

        <TwitterShareButton url={this.props.songUrl}>
          <TwitterIcon size={40} round={false} />
        </TwitterShareButton>

        <GooglePlusShareButton url={this.props.songUrl}>
          <GooglePlusIcon size={40} round={false} />
        </GooglePlusShareButton>

        <RedditShareButton url={this.props.songUrl}>
          <RedditIcon size={40} round={false} />
        </RedditShareButton>

        <EmailShareButton url={this.props.songUrl}>
          <EmailIcon size={40} round={false} />
        </EmailShareButton>

        <style jsx>{`
          .share-box-links {
            margin-top: 10px;
          }
        `}</style>
        <style global jsx>{`
          .share-box-links > div {
            display: inline-block;
            margin-right: 10px;
            cursor: pointer;
          }
        `}</style>
      </div>
  );
}
