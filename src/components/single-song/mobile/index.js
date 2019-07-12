import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import OutlineSingleSongControls from 'components/buttons/single-song-controls/outline';
import HeaderTitle from 'components/song-post/header/title';
import MetaInfo from 'components/song-post/header/meta-info';
import SongPostContent from 'components/song-post/content';
import RelatedSongs from '../related-songs';
import Placeholder from './placeholder';

export default class SingleSongMobile extends Component {

  static propTypes = {
    singleSong: PropTypes.object.isRequired,
    songPlayStatus: PropTypes.string.isRequred,
    songPlayerFunctions: PropTypes.object.isRequired,
    relatedSongs: PropTypes.array.isRequired
  }

  render = () => (
      <div className="single-song-mobile">
        { !!this.props.singleSong.id ?
          <Fragment>

            <div className="song-image-wrapper">
              <img className="song-image" src={this.props.singleSong.image_url} />

              <div className="song-title-wrapper">
                <OutlineSingleSongControls
                  songPlayerStatus={this.props.songPlayerStatus}
                  songPlayerFunctions={this.props.songPlayerFunctions}
                />
                <HeaderTitle songData={this.props.singleSong} />
              </div>
            </div>

            <div className="single-song-post-content">
              <MetaInfo songData={this.props.singleSong} />
              <SongPostContent songData={this.props.singleSong} />
            </div>

            <RelatedSongs relatedSongsData={this.props.relatedSongs} />

          </Fragment>
          :
          <Placeholder />
        }

        <style jsx>{`
          .song-image-wrapper {
            position: relative;
            width: 100vw;
            height: 100vw;
          }
        `}</style>
        <style jsx global>{`
          .single-song-mobile .song-image {
            width: 100%;
          }
          .single-song-mobile .song-title-wrapper {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.8);
            padding: 2px 5px;
            box-sizing: border-box;
          }
          .single-song-mobile .outline-single-song-controls {
            display: inline-block;
            width: 50px;
            height: 50px;
            padding-top: 4px;
          }
          .single-song-mobile .outline-single-song-controls svg {
            width: 100%;
            height: 100%;
          }
          .single-song-mobile .header-title {
            display: inline-block;
            vertical-align: top;
            box-sizing: border-box;
            padding-left: 10px;
            padding-top: 8px;
            width: calc(100% - 50px - 45px); // MUST override if play button visible + text wraps image
            font-size: 15pt;
          }
          .single-song-mobile .spotify-link {
            position: absolute;
            right: 15px;
            top: 15px;;
            font-size: 30px;
          }
          .single-song-mobile .single-song-post-content {
            width: 100%;
            padding: 15px;
            box-sizing: border-box;
            font-size: 15px;
            line-height: 26px;
          }
        `}</style>
      </div>
  )
}
