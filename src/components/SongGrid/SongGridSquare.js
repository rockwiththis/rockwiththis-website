import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import YouTube from 'react-youtube'

import head from 'images/head.png'
import  pauseButton  from 'images/PAUSE-BUTTON.png'
import  playButton  from 'images/playbutton.svg'
import './SongGridSquare.scss'



class SongGrid extends Component {

    renderTags() {
        const {
            song,
        } = this.props

        const tags = song.sub_genres.map(tag =>
            <span key={tag.name} className="grid-tag">#{tag.name}</span>)

        return (
            <span className="postTags">
                {tags}
            </span>
        )
    }


    render() {
        const {
            song,
            activeSong,
            isPlaying,
        } = this.props

        return (
            <div
              id={song.id}
              data-index={this.props.index}
              className={`songContainer ${this.props.activeDiscoverFullSong ? 'activeDiscoverFullSong' : ''}`}
              key={`${song.id}`}
              onClick={() => this.props.actions.updateSnapshotSong(song)}
            >
                <div className="imageContainer">
                  <div className="imageHover">
                    <img src={head} />
                    <div className="tagWrapper">
                      {this.renderTags()}
                    </div>

                  </div>
                    <img className="carousel-song-image songImage" src={song.image_url} />
                </div>
            </div>
        )
    }
}

SongGrid.propTypes = {
    song: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    activeSong: PropTypes.object,
}

SongGrid.defaultProps = {
    activeSong: {},
}

export default SongGrid
