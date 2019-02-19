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

    renderGenreTags = () =>
      <span className="postTags">
        { this.props.song.sub_genres.map(genre =>
            <span key={genre.name} className="grid-tag">#{genre.name}</span>
        ) }
      </span>

    render() {
        // Using this `songContainer` class in multiple components makes CSS'ing really hard
        return (
            <div
              className={['songContainer', this.props.className].join(' ')}
              onClick={this.props.onClick}
            >
              {/* TODO remove this div if possible */}
              <div className="imageContainer">

                { this.props.showGenresOnHover &&
                  <div className="imageHover">
                    <img src={head} />
                    <div className="tagWrapper">
                      {this.renderGenreTags()}
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
