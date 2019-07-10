import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FullSongPlaceholder from './FullSongPlaceholder';
import SongGridPlaceholder from './SongGridPlaceholder';
import SongGridSong from './song-grid-song';
import Loading from '../loading-more-songs';
import SongPost from 'components/song-post';

export default class FullView extends Component {

  static propTypes = {
    songPosts: PropTypes.object.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired,
    songDataFunctions: PropTypes.object.isRequired
  }

  handleGridScroll = e => {
    const scrollThreshold = e.target.scrollHeight - (e.target.offsetHeight + 100);

    if (e.target.scrollTop > scrollThreshold && !this.props.songDataFunctions.isLoading)
      this.props.songDataFunctions.loadMore();
  }

  render() {
    if (this.props.songPosts.filtered.length === 0) return (
        <div className="full-view">
          <div className="song-grid-container">
            <SongGridPlaceholder />
          </div>
          <div className="discover-full-song-container">
            <FullSongPlaceholder />
          </div>
        </div>
    );
    return (
        <div className="full-view">
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

          <style jsx>{`
            .full-view {
              position: relative;
              padding: 15px;
              box-sizing: border-box;
              height: 100%;
            }
            .song-grid-container {
              display: inline-block;
              width: 40%;
              height: 100%;
              overflow-y: scroll;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .song-grid-container::-webkit-scrollbar {
              width: 0px;
            }
          `}</style>
          <style global jsx>{`
            .full-view .song-post {
              display: inline-block;
              vertical-align: top;
              width: 60%;
              padding: 0 35px;
              box-sizing: border-box;
              height: 100%;
              overflow-y: scroll;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .full-view .song-post::-webkit-scrollbar {
              width: 0px;
            }
            .full-view .song-post .song-image {
              width: 40%;
              padding-right: 20px;
              padding-bottom: 20px;
              box-sizing: border-box;
            }
            .full-view .header-title {
              // TODO should we fix the entire header width instead?
              // also, the 20px padding is not actually used b/c the image is a border-box
              // -40% for image, -20px for padding, -50px for play button
              width: calc(60% - 20px - 50px);
              margin-bottom: 10px;
              font-size: 19pt;
            }
            .full-view .spotify-link {
              color: #65d36e;
              vertical-align: middle;
              padding-left: 5px;
              font-size: 18pt;
            }
            .full-view .song-post-content {
              font-size: 12pt;
              line-height: 24pt;
            }
            .full-view .outline-single-song-controls {
              width: 50px;
              height: 50px;
            }
          `}</style>
        </div>
    )
  }
}
