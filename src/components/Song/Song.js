import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import AnimateHeight from 'react-animate-height'
import { Icon } from 'react-fa'
import YouTube from 'react-youtube'
import ShareBox from 'components/ShareBox/ShareBox'

import playButton from 'images/playbutton.svg'
import pauseButton from 'images/pauseButton.png'
import loadingButton from 'images/loading.gif'
import pauseButtonWhite from 'images/PAUSE-BUTTON.png'
import hoverGradient from 'images/rwt-hover-gradient.png'


class Song extends Component {
    constructor(props) {
        super(props)
        this.ytPlayer = null
        this.state = {
            expanded: false
        }
    }

    onPressPlay = song => event => {
      // TODO this should be determined by caller
      // to guarantee that appearance of button aligns w/ its behavior
      console.log(event);
      const isPlayButton = (
          !this.props.isPlaying ||
          song.id !== this.props.activeSong.id
      );
      if (isPlayButton) this.props.actions.toggleSong(song);
      else this.props.actions.togglePlayPause(false);
    }

    renderTags() {
        const {
            song,
        } = this.props

        const tags = song.sub_genres.map(tag =>
            <span key={tag.name} className="tag">#{tag.name}</span>)

        return (
            <span className="postTags">
                {tags}
            </span>
        )
    }
    renderHoverTags() {
        const {
            song,
        } = this.props

        const tags = song.sub_genres.map(tag =>
            <span key={tag.name} className="hover-tag">#{tag.name}</span>)

        return (
            <span className="postTags">
                {tags}
            </span>
        )
    }


    renderTop() {
        const {
            song,
            activeSong,
            isPlaying,
            layout,
        } = this.props

        const readyToPlay = !!this.props.songPlayerDurations[song.id];
        const playPauseButton = !readyToPlay ?
          <img src={loadingButton} className="loadingButton" height="60" width="60" /> :
          song.id === activeSong.id && isPlaying ?
            <img src={pauseButtonWhite} className="pauseButton" /> :
            <svg className="playButton" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"/></svg>

        return (
            <div className="topContentContainer" >
              <div className="postInfoContainer" >
                <div className="singlePostPlayer hideMobile">
                    <button
                        className="singlePostPlayerButton"
                        onClick={readyToPlay && this.onPressPlay(song)}
                    >
                        {playPauseButton}
                    </button>

                </div>

                {this.props.layout == 'snapshot'
                  ?
                <div className="marquee songInfo mobile" onClick={this.onPressPlay(song)}>
                    <Link className="postTitleLink" to={`/songs/${song.id}`}><span className="songName">{song.name}</span></Link><br />
                      <span className="artistName">{song.artist_name}</span>
                </div>
                :
                <div className="marquee songInfo mobile">
                    <Link className="postTitleLink" to={`/songs/${song.id}`}><span className="songName">{song.name}</span></Link><br />
                      <span className="artistName">{song.artist_name}</span>
                </div>
              }

                <div className="marquee songInfo desktop">
                  <div id="checkOverFlowSong" className="marquee-inner songtitle">
                  <Link className="songName postTitleLink" to={`/songs/${song.id}`}>{song.name}</Link><a target="_blank" href={song.spotify_link}  className="spotify"><i className="fa fa-spotify" aria-hidden="true" /></a>
                  </div>
                    <br />
                  <div id="checkOverFlowArtist" className="marquee-inner artist">
                    <span className="artistName">{song.artist_name}</span>
                  </div>
                </div>

                <p className="metaInfo">
                    <p className="leftInfo desktop">
                    <span className="postDate "><Moment format="ll" date={song.created_at} /> | <span className="postAuthor">Jared Paul</span> | </span>
                    </p>
                    <p className="leftInfo mobile">
                    <span className="postDate "><Moment format="M/d/YY" date={song.created_at} /> | <span className="postAuthor">Jared Paul</span> | </span>
                    </p>
                    {this.renderTags(song)}

                    <ShareBox song={song} />

                </p>
              </div>
              <div className={`bottomContentContainer ${this.state.expanded ? 'expanded' : ''}`}>
                  <p className="songDescription" dangerouslySetInnerHTML={{ __html: song.description }} />
              </div>
            </div>
        )
    }


    render() {
        const {
            song,
            activeSong,
            isPlaying,
        } = this.props

        const playPauseButton = song.id === activeSong.id && isPlaying ? (
            <img src={pauseButton} className="pauseButton" />
        ) : (
            <img src={playButton} className="playButton" />
        )

        const { height } = this.state

        return (
            <div id={song.slug} className="songContainer clearfix" key={`${song.id}`}>
            <div className="wrapper"  >
                <div className="postContent" >

                    <div className="imageContainer">
                            <Link className="song-hover-link" to={`/songs/${song.id}`}>
                              <div className="hover-content">
                                  <div className="tagWrapper">
                                    {this.renderHoverTags()}
                                  </div>
                                  <p className="goToPage">
                                    Read More
                                  </p>
                              </div>
                              <img className="heroHoverGradient" src={hoverGradient} />
                            </Link>

                            <img className="songImage" src={song.image_url} />
                            <div className="songImageInfoContainer grid">
                              <button
                                  className="singlePostPlayerButton"
                                  onClick={this.onPressPlay(song)}
                              >
                                  {playPauseButton}
                              </button>
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

Song.propTypes = {
    song: PropTypes.object.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    activeSong: PropTypes.object,
}

Song.defaultProps = {
    activeSong: {},
}

const mapStateToProps = (state, ownProps) => {
    const {
        isPlaying,
        activeSong,
    } = state

    return {
        isPlaying,
        activeSong,
    }
}


export default connect(
    mapStateToProps,
    null
)(Song)
