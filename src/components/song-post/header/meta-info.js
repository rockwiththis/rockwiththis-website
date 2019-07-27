import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { FaShareAlt } from 'react-icons/fa';

import GenreTags from 'components/song-shared/genre-tags';
import ShareBox from './share-box';

export default class MetaInfo extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { showShareBox: true }
  }

  getSongCuratorFullName = () =>
    `${this.props.songData.curator_first_name} ${this.props.songData.curator_last_name}`;

  showShareBox = () => {
    console.log("SHOW SHARE BOX");
    this.setState({ showShareBox: true });
  }
  hideShareBox = () => this.setState({ showShareBox: false })

  render = () => (
      <div className="meta-info">

        <span className="curated-by">Curated by </span>
        <span className="curator-name">{this.getSongCuratorFullName()}</span>
        <span className="separator">|</span>
        <GenreTags song={this.props.songData} firstOnly={true} />

        <div className="share-button" onClick={this.showShareBox}>
          <FaShareAlt />
        </div>
        <ShareBox
          song={this.props.songData}
          isShowing={this.state.showShareBox}
          closePopup={this.hideShareBox}
        />

        <style jsx>{`
          .meta-info {
            font-size: 14pt;
          }
          .curator-name {
            font-weight: bold;
          }
          .separator {
            margin: 0 10px;
          }
          .share-button {
            display: inline-block;
            vertical-align: top;
            color: #f85f27;
            font-size: 18pt;
            cursor: pointer;
          }
        `}</style>
        <style global jsx>{`
          .meta-info .genre-tag {
            padding: 6px 8px;
            border-radius: 4px;
            color: #fff;
            background: #1a6ea9;
            font-size: 11px;
            margin-right: 10px;
            vertical-align: middle;
          }
        `}</style>
      </div>
  )
}
