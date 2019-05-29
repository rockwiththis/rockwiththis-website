import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import AnimateHeight from 'react-animate-height'
import { Icon } from 'react-fa'
import YouTube from 'react-youtube'
import ShareBox from 'components/ShareBox/ShareBox'

import { playSong, pauseSong } from 'actions/player';

import OutlineSingleSongControls from 'components/buttons/single-song-controls/outline';
import BadgeSingleSongControls from 'components/buttons/single-song-controls/badge';

import hoverGradient from 'images/hero-hover-gradient.png'

const propTypes = {
  song: PropTypes.object.isRequired,

  // Redux
  isPlaying: PropTypes.bool.isRequired,
  activeSong: PropTypes.object.isRequired,
  nextSong: PropTypes.object,
  discoverLayout: PropTypes.string,
  songPlayerDurations: PropTypes.objectOf(PropTypes.number),
  playSong: PropTypes.func.isRequired,
  pauseSong: PropTypes.func.isRequired
}

class Song extends Component {

  // Current loading animation behavior (kind of) ... keeping around for reference
  isLoading = () =>
    this.props.nextSong &&
    this.props.song.id === this.props.nextSong.id

  renderTags = (className = 'tag') => (
    <span className="postTags">
      { this.props.song.sub_genres.map(genre => (

          <span key={genre.name} className={className}>{genre.name}</span>
      ))}
    </span>
  );

  renderHoverTags = () => this.renderTags('hover-tag');

  // TODO eliminate duplicate @ SingleSong.js
  parsedDescription = song =>
    song.description.replace(/\n+/g, '<br />  ')

  renderTop() {
    const { song } = this.props;

    return (
        <div className="topContentContainer">

          <div className="postInfoContainer">
            <OutlineSingleSongControls
              isPlaying={this.props.isPlaying}
              isActiveSong={song.id === this.props.activeSong.id}
              isLoading={!this.props.songPlayerDurations[song.id]}
              pauseSong={() => this.props.pauseSong(song)}
              playSong={() => this.props.playSong(song)}
            />

            <div className="songInfo mobile">
              <Link to={`/songs/${song.id}`}>
                <div className="postTitleLink">
                  <span className="songName">{song.name}</span>
                </div>
                <span className="artistName">{song.artist_name}</span>
              </Link>
            </div>

            <div className="songInfo desktop">
              <div className="songtitle">
                <Link className="songName postTitleLink" to={`/songs/${song.id}`}>
                  {song.name}
                </Link>
                <a target="_blank" href={song.spotify_link} className="spotify">
                  <i className="fa fa-spotify" aria-hidden="true" />
                </a>
              </div>

              <div className="artist">
                <span className="artistName">{song.artist_name}</span>
              </div>
            </div>

            <p className="metaInfo">
              <p className="leftInfo desktop">
                <span className="postAuthor">
                  <span className="curatedBy">Curated by </span>
                  <span className="curatorName">{`${song.curator_first_name} ${song.curator_last_name}`}</span>
                </span>
                &nbsp;
                <span className="separater">|</span>
              </p>
              <p className="leftInfo mobile">
                <span className="postAuthor">
                  <span className="curatedBy">Curated by </span>
                  <span className="curatorName">{`${song.curator_first_name} ${song.curator_last_name}`}</span>
                </span>
                &nbsp;
                <span className="separater">|</span>
              </p>

              {this.renderTags()}

              <ShareBox song={song} />
            </p>

          </div>

          <div className="bottomContentContainer">
            <p
              className="songDescription"
              dangerouslySetInnerHTML={{ __html: this.parsedDescription(song) }}
            />
          </div>

        </div>
    )
  }

  render() {
    const { song } = this.props;

    return (
        <div id={song.slug} className="songContainer clearfix" key={`${song.id}`}>

          <div className="wrapper">
            <div className="postContent" >

              <div className="imageContainer">

                <Link className="song-hover-link" to={`/songs/${song.id}`}>
                  <div className="hover-content">
                    <div className="tagWrapper">
                      {this.renderHoverTags()}
                    </div>
                    <p className="goToPage">Read More</p>
                  </div>

                  <img className="heroHoverGradient" src={hoverGradient} />
                </Link>

                <img className="songImage" src={song.image_url} />

                <div className="songImageInfoContainer grid">
                  <BadgeSingleSongControls
                    isPlaying={this.props.isPlaying}
                    isActiveSong={this.props.song.id === this.props.activeSong.id}
                    isLoading={!this.props.songPlayerDurations[this.props.song.id]}
                    pauseSong={() => this.props.pauseSong(this.props.song)}
                    playSong={() => this.props.playSong(this.props.song)}
                  />

                  <div className="song-info">
                    <p className="song-title">{song.name}</p>
                    <p className="song-artist">{song.artist_name}</p>
                  </div>
                </div>

              </div>

              {this.renderTop()}

            </div>
          </div>

          <Link className="goToSongPage" to={`/songs/${song.id}`}>
            <i className="im im-angle-right"></i>
          </Link>

          <Link className="seeMore" to={`/songs/${song.id}`}>
            <span>...see more</span>
            <i className="im im-angle-right"></i>
          </Link>

          <hr />

        </div>
    )
  }
}

Song.propTypes = propTypes;

export default connect(
    ({
      isPlaying,
      activeSong,
      nextSong,
      discoverLayout,
      songPlayerDurations
    }) => ({
      isPlaying,
      activeSong,
      nextSong,
      discoverLayout,
      songPlayerDurations
    }),
    { playSong, pauseSong }
)(Song)
