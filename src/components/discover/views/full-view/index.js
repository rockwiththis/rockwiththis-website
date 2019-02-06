import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { updateSpotlightSong } from 'actions';

const songShape = {
  id: PropTypes.number
}

const propTypes = {
  songs: PropTypes.arrayOf(PropTypes.shape(songShape)).isRequired,
  spotlightSong: PropTypes.shape(songShape).isRequired,

  // connected actions
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

    if (currIndex >= 0)
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
    if (songGridSquares.length === 0) return (
        <div className="fullView">
          <SongGridPlaceholder />
          <FullSongPlaceHolder />
        </div>
    );

    return (
        <div className="fullView">

          <div className="songGrid">
            {this.props.songs.map(song => (
                <SongGridSquare
                  key={song.id}
                  song={song}
                  className={
                    this.props.spotlightSong.id === song.id &&
                    'activeDiscoverFullSong'
                  }
                  showGenresOnHover={true}
                  onClick={() => this.props.updateSpotlightSong(song)}
                >
            )}
          </div>

          <div className="discover-full-song">
            <button
              className="toggle-song previous"
              onClick={this.showPreviousDiscoverSong}
            >
              <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
            </button>

            <Song
              {...this.props}
              song={this.props.spotlightSong}
            >

            <button
              className="toggle-song next"
              onClick={this.showNextDiscoverSong}
            >
              <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
            </button>
          </div>

        </div>
    )
  }
}

FullView.propTypes = propTypes;

export default connect(
  null,
  { updateSpotlightSong, loadMoreSongs }
)(FullView);
