import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';

import { propTypes } from './index';
import SongGridSong from './song-grid-song';
import Loading from '../../loading-more-songs';
import SongPost from 'components/song-post';
import Placeholder from './placeholder';

export default class FullViewDesktop extends Component {

  static propTypes = propTypes;

  render = () => (
      <div className="full-view-desktop">
        {this.props.songPosts.filtered.length < 0 ?
          <Fragment>

            <div className="song-grid-container">
              <div className="song-grid" onScroll={this.handleGridScroll}>
                {this.props.songPosts.filtered.map(songData => (
                    <SongGridSong
                      key={songData.id}
                      songData={songData}
                      isSpotlight={this.props.songPosts.spotlight.id === songData.id}
                      setSongAsSpotlight={() => this.props.songDataFunctions.setSpotlight(songData)}
                    />
                ))}

                {this.props.songDataFunctions.isLoading &&
                  <div className='loading-bottom'>
                    <Loading />
                  </div>
                }
              </div>
            </div>

            <SongPost
              songData={this.props.songPosts.spotlight}
              songPlayStatus={this.props.songPlayStatusForSong(this.props.songPosts.spotlight)}
              songPlayerFunctions={this.props.songPlayerFunctionsForSong(this.props.songPosts.spotlight)}
            />

          </Fragment>
          :
          <Placeholder />
        }

        <style jsx>{`
          .full-view-desktop {
            padding: 20px;
            padding-bottom: 0;
            box-sizing: border-box;
            height: 100vh;
          }
          .song-grid {
            height: 100%;
            // This somehow prevents space between rows of grid songs 
            // ... fucking CSS bullshit
            line-height: 0;
            font-size: 0;
          }
        `}</style>
        <style global jsx>{`
          .full-view-desktop .song-grid-container {
            display: inline-block;
            width: 40%;
            height: 100%;
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .full-view-desktop .song-grid-container::-webkit-scrollbar {
            width: 0px;
          }
          .full-view-desktop .song-post {
            display: inline-block;
            vertical-align: top;
            width: 60%;
            padding-left: 35px;
            box-sizing: border-box;
            height: 100%;
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .full-view-desktop .song-post::-webkit-scrollbar {
            width: 0px;
          }
          .full-view-desktop .song-post .song-image {
            width: 40%;
            padding-right: 20px;
            padding-bottom: 20px;
            box-sizing: border-box;
          }
          .full-view-desktop .header-title {
            width: calc(60% - 50px) !important;
            margin-bottom: 10px;
            font-size: 19pt;
          }
          .full-view-desktop .spotify-link {
            color: #65d36e;
            vertical-align: middle;
            padding-left: 5px;
            font-size: 18pt;
          }
          .full-view-desktop .song-post-content {
            font-size: 12pt;
            line-height: 24pt;
          }
          .full-view-desktop .outline-single-song-controls {
            width: 50px !important;
            height: 50px !important;
          }
        `}</style>
      </div>
  )
}
