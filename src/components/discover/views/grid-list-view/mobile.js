import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { propTypes } from './index';
import TruncatedSongPost from 'components/song-post/truncated';

export default class GridListViewMobile extends Component {

  static propTypes = propTypes

  render = () => (
      <div className="grid-list-view-mobile">

        {this.props.songData.filtered.map(songData => (
            <Link href={`/songs/[id]?id=${songData.id}`} as={`/songs/${songData.id}`}>
              <img src={songData.image_url} />
            </Link>
        ))}
        
        <style jsx>{`
          .grid-list-view-mobile {
            line-height: 0;
            font-size: 0;
          }
          img {
            width: 33.3vw;
            height: 33.3vw;
          }
        `}</style>
      </div>
  );
}

