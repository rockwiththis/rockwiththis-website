import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateSpotlightSong } from 'actions/set-state';
import { loadMoreSongs } from 'actions/fetch/songs';

import FullSongPlaceholder from './FullSongPlaceholder';
import SongGridPlaceholder from './SongGridPlaceholder';
import SongGridSquare from 'components/SongGrid/SongGridSquare';
import Song from 'components/Song/Song';
import LoadingComponent from 'components/Loading/LoadingComponent';

// import './stylesheets/FullView.scss'
// import './stylesheets/FullViewMobile.scss'

const propTypes = {
  // from redux
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  spotlightSong: PropTypes.object.isRequired,
  loadingSongs: PropTypes.bool.isRequired,
  updateSpotlightSong: PropTypes.func.isRequired,
  loadMoreSongs: PropTypes.func.isRequired
}

// TODO avoid storing direct s3 image links in code

class FullView extends Component {

  getSpotlightSongIndex = () => (
      this.props.songs.findIndex(song => (
          song.id === this.props.spotlightSong.id
      ))
  );

  showPreviousDiscoverSong = () => {
    const newIndex = this.getSpotlightSongIndex() - 1;

    if (newIndex >= 0)
      this.props.updateSpotlightSong(this.props.songs[newIndex]);
  }

  showNextDiscoverSong = () => {
    const newIndex = this.getSpotlightSongIndex() + 1;

    if (newIndex >= this.props.songs.length)
      this.props.loadMoreSongs({ updateSpotlight: true });
    else
      this.props.updateSpotlightSong(this.props.songs[newIndex]);
  }

  handleScroll = e => {
    const scrollThreshold = e.target.scrollHeight - (e.target.offsetHeight + 100);

    if (e.target.scrollTop > scrollThreshold && !this.props.loadingSongs)
      this.props.loadMoreSongs();
  }

  render() {
    if (this.props.songs.length === 0) return (
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
            <div className="songGrid" onScroll={this.handleScroll}>
              {this.props.songs.map(song => (
                  <SongGridSquare
                    key={song.id}
                    song={song}
                    className={
                      this.props.spotlightSong.id === song.id ?
                      'activeDiscoverFullSong' : null
                    }
                    showGenresOnHover={true}
                    onClick={() => this.props.updateSpotlightSong(song)}
                  />
              ))}

              {this.props.loadingSongs &&
                <div className='loading-bottom'>
                  <LoadingComponent />
                </div>
              }
            </div>
          </div>

          <div className="discover-full-song-container">
            <div className="discover-full-song">
              <button
                className="toggle-song previous"
                onClick={this.showPreviousDiscoverSong}
              >
                <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
              </button>

              <Song song={this.props.spotlightSong} />

              <button
                className="toggle-song next"
                onClick={this.showNextDiscoverSong}
              >
                <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
              </button>
            </div>
          </div>

        </div>
    )
  }
}

FullView.propTypes = propTypes;

export default connect(
  ({ filteredPosts, spotlightPost, loadingSongs }) => ({
    songs: filteredPosts,
    spotlightSong: spotlightPost,
    loadingSongs
  }),
  { updateSpotlightSong, loadMoreSongs }
)(FullView);
