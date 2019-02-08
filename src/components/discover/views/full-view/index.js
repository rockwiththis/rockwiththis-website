import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateSpotlightSong, loadMoreSongs } from 'actions';
import FullSongPlaceholder from './FullSongPlaceholder';
import SongGridPlaceholder from './SongGridPlaceholder';
import SongGridSquare from 'components/SongGrid/SongGridSquare';
import Song from 'components/Song/Song';

import './stylesheets/FullView.scss'
import './stylesheets/FullViewMobile.scss'


const propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,

  // from redux
  spotlightSong: PropTypes.object.isRequired,
  updateSpotlightSong: PropTypes.func.isRequired,
  loadMoreSongs: PropTypes.func.isRequired
}

// TODO avoid storing direct s3 links in code

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

  render() {
    if (this.props.songs.length === 0) return (
        <div className="fullView">
          <SongGridPlaceholder />
          <FullSongPlaceholder />
        </div>
    );
    return (
        <div className="fullView">

          <div className="song-grid-container">
            <div className="songGrid">
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
  ({ spotlightPost }) => ({ spotlightSong: spotlightPost }),
  { updateSpotlightSong, loadMoreSongs }
)(FullView);
