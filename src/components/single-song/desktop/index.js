import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import SongPost from 'components/song-post';
import RelatedSongs from '../related-songs';
import Placeholder from './placeholder';

export default class SingleSongDesktop extends Component {

  static propTypes = {
    singleSong: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
    relatedSongs: PropTypes.array.isRequired
  }

  // TODO move related songs on smaller widths

  render = () => (
      <div className="single-song-desktop">
        { !!this.props.singleSong.id ?
            <Fragment>
              <SongPost
                songData={this.props.singleSong}
                songPlayStatus={this.props.songPlayStatus}
                songPlayerFunctions={this.props.songPlayerFunctions}
              />

              <RelatedSongs relatedSongsData={this.props.relatedSongs} />
            </Fragment>
            :
            <Placeholder />
        }

        <style global jsx>{`
          .single-song-desktop .song-post {
            width: 86%;
            height: 100%;
            display: inline-block;
            vertical-align: top;
          }
          .single-song-desktop .song-post .song-image {
            width: 45%;
          }
          .single-song-desktop .song-header {
            width: 55%;
            height: 100px;
            margin-left: 45%;
            padding 0 25px;
            box-sizing: border-box;
          }
          .single-song-desktop .song-post-content {
            height: calc(100% - 100px);
            margin-left: 45%;
            padding 0 25px;
            box-sizing: border-box;
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .single-song-desktop .song-post-content::-webkit-scrollbar {
            width: 0px;
          }
          .single-song-desktop .song-header {
            font-size: 19pt;
          }
          .single-song-desktop .song-post-content {
            font-size: 10.5pt;
            line-height: 28px;
            font-weight: 100;
          }
          @media (max-width: 1200px) {
            .single-song-desktop .song-post {
              width: 100%
            }
          }
        `}</style>
      </div>
  )
}
