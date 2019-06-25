import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateSpotlightSong } from 'actions/set-state';
import { loadMoreSongs } from 'actions/fetch/songs';

import FullSongPlaceholder from './FullSongPlaceholder';
import SongGridPlaceholder from './SongGridPlaceholder';
import SongGrid from './song-grid';
import FullSong from './full-song';
import Loading from '../loading-more-songs';

export default class FullView extends Component {

  static propTypes = {
    songPosts: PropTypes.object.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired,
    updateSpotlightSong: PropTypes.func.isRequired,
    loadMoreSongs: PropTypes.func.isRequired,
    isLoadingSongs: PropTypes.bool.isRequired
  }

  handleGridScroll = e => {
    const scrollThreshold = e.target.scrollHeight - (e.target.offsetHeight + 100);

    if (e.target.scrollTop > scrollThreshold && !this.props.isLoadingSongs)
      this.props.loadMoreSongs();
  }

  render() {
    if (this.props.songPosts.length === 0) return (
        <div className="fullView">
          <div className="song-grid-container">
            <SongGridPlaceholder />
          </div>
          <div className="discover-full-song-container">
            <FullSongPlaceholder />
          </div>
        </div>
    );
    return (
        <div className="fullView">
          <div className="song-grid-container">
            <div className="songGrid" onScroll={this.handleGridScroll}>
              {this.props.songPosts.map(songData => (
                  <SongGrid
                    key={songData.id}
                    songData={songData}
                    isSpotlight={this.props.spotlightSong.id === songData.id}
                    setSongAsSpotlight={() => this.props.updateSpotlightSong(songData)}
                  />
              ))}

              {this.props.isLoadingSongs &&
                <div className='loading-bottom'>
                  <Loading />
                </div>
              }
            </div>
          </div>
          <FullSong song={this.props.spotlightSong} />
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
