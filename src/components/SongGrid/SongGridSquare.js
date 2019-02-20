import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import YouTube from 'react-youtube'

import head from 'images/head.png'
import  pauseButton  from 'images/PAUSE-BUTTON.png'
import  playButton  from 'images/playbutton.svg'
import './SongGridSquare.scss'

const propTypes = {
  song: PropTypes.shape({
    sub_genres: PropTypes.arrayOf(PropTypes.string),
    image_url: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  showGenresOnHover: PropTypes.bool
}

class SongGrid extends Component {

    renderSongInfo = () =>
      <span className="gridSongInfo">

        <span className="song-name">{this.props.song.name}</span>
        <span className="artist-name">{this.props.song.artist_name}</span>

      </span>

    render() {
        // Using this `songContainer` class in multiple components makes CSS'ing really hard

        console.log("zzz", this.props.song);
        return (
            <div
              className={['songContainer', this.props.className].join(' ')}
              onClick={this.props.onClick}
            >
              {/* TODO remove this div if possible */}
              <div className="imageContainer">

                { this.props.showGenresOnHover &&
                  <div className="imageHover">

                    <div className="contentWrapper">
                      <span className="readMore">Read More</span>
                      {this.renderSongInfo()}
                    </div>
                  </div>
                }

                <img
                  className="carousel-song-image songImage"
                  src={this.props.song.image_url}
                />
              </div>

            </div>
        )
    }
}

SongGrid.propTypes = propTypes

export default SongGrid
