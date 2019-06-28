import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FullSongPlaceholder from './FullSongPlaceholder';
import SongGridPlaceholder from './SongGridPlaceholder';
import SongGridSong from './song-grid-song';
import FullSong from './full-song';
import Loading from '../loading-more-songs';

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
          <FullSong
            songData={this.props.songPosts.spotlight}
            songPlayStatus={this.props.songPlayStatusForSong(this.props.songPosts.spotlight)}
            songPlayerFunctions={this.props.songPlayerFunctionsForSong(this.props.songPosts.spotlight)}
          />

          <style jsx>{`
            .full-view {
              padding: 15px;
              box-sizing: border-box;
            }
            .song-grid-container {
              display: inline-block;
              width: 40%;
            }
          `}</style>
          <style global jsx>{`
            .full-song {
              display: inline-block;
              width: calc(60% - 200px);
              box-sizing: border-box;
              margin: 0 100px;
              vertical-align: top;
            }
          `}</style>
        </div>
    )
  }
}

/*
export default connect(
  ({ filteredPosts, spotlightPost, loadingSongs }) => ({
    songs: filteredPosts,
    spotlightSong: spotlightPost,
    loadingSongs
  }),
  { updateSpotlightSong, loadMoreSongs }
)(FullView);
*/
