import React, { Component } from 'react'
import PropTypes from 'prop-types';

import GenreTags from 'components/song-shared/genre-tags';
import ShareBox from './share-box';

export default class MetaInfo extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired
  }

  getSongCuratorFullName = () =>
    `${this.props.songData.curator_first_name} ${this.props.songData.curator_last_name}`;

  render = () => (
      <div className="meta-info">

        <span className="curated-by">Curated by </span>
        <span className="curator-name">{this.getSongCuratorFullName()}</span>
        <span className="separator">|</span>
        <GenreTags song={this.props.songData} firstOnly={true} />
        <ShareBox song={this.props.songData} />

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
