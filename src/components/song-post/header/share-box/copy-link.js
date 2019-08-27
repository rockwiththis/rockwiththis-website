import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

export default class ShareBoxCopyLink extends Component {

  static propTypes = {
    songUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { copied: false };
  }

  onCopyUrl() {
    this.setState({ copied: true })
    setTimeout(() => this.setState({ copied: false }), 2000);
  }

  render = () => (
      <form className="share-box-copy-link">
        <CopyToClipboard
          text={this.props.songUrl}
          onCopy={() => this.onCopyUrl()}
        >
          <input readOnly className="url" value={this.props.songUrl} />
        </CopyToClipboard>

        <CopyToClipboard
          text={this.props.songUrl}
          onCopy={() => this.onCopyUrl()}
        >
          <div className="clipboard-icon-container">
            <FaCopy />
          </div>
        </CopyToClipboard>

        { this.state.copied &&
          <span className="tooltip">Copied!</span>
        }

        <style jsx>{`
          .share-box-copy-link {
            margin-top: 10px;
            position: relative;
          }
          .url {
            display: inline-block;
            width: calc(100% - 30px);
            height: 30px;
            box-sizing: border-box;
            padding-left: 5px;
          }
          .clipboard-icon-container {
            display: inline-block;
            vertical-align: top;
            width: 30px;
            height: 30px;
            text-align: center;
            padding-top: 6px;
            box-sizing: border-box;
            background-color: #1a6ea9;
            color: white;
            font-size: 16px;
            cursor: pointer;
          }
          .tooltip {
            position: absolute;
            color: green;
            top: -30px;
            right: 0;
          }
        `}</style>
      </form>
  );
}
