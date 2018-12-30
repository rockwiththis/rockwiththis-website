import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import AnimateHeight from 'react-animate-height'
import { Icon } from 'react-fa'
import YouTube from 'react-youtube'
import { Helmet } from 'react-helmet';

import { toggleSong, togglePlayPause } from 'actions/queue'
import ShareBox from 'components/ShareBox/ShareBox'

import  pauseButton  from 'images/PAUSE-BUTTON.png'

import './SingleSong.scss'


class SingleSong extends Component {
    constructor(props) {
      super(props);
      this.state = { expanded: false };
      props.actions.updateSnapshotSong(this.props.singleSong);
    }

    // TODO This duplicate logic should be standardized
    onPressPlay(song) {
      const isPlayButton = (
          !this.props.isPlaying ||
          song.id !== this.props.activeSong.id
      );
      if (isPlayButton) this.props.actions.toggleSong(song);
      else this.props.actions.togglePlayPause(false);
    }

    renderPlayer() {
        const {
            activeSong,
            isPlaying,
        } = this.props
        const song = this.props.singleSong
        const playPauseButton = song.id === activeSong.id && isPlaying ? (
          <img src={pauseButton} className="pauseButton" />

        ) : (
          <svg className="playButton" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"/></svg>

        )


        return (
          <div className='player-button'>
            <button
                className="singlePostPlayerButton"
                onClick={() => this.onPressPlay(song)}
            >
                {playPauseButton}
            </button>
          </div>
        )
    }

    renderDescription() {
        const song = this.props.singleSong
        console.log("this.props.singleSong");
        console.log(this.props.singleSong);
        return (
              <div className={`bottomContentContainer ${this.state.expanded ? 'expanded' : ''}`}>
                  <p className="songDescription" dangerouslySetInnerHTML={{ __html: this.props.singleSong.description }} />
              </div>
        )
    }

    render() {
      console.log(this.props)
        const {
            activeSong,
            isPlaying,
        } = this.props
        const song = this.props.singleSong

        const { height } = this.state
        const songTagsMeta = song.sub_genres.map(tag => {
          return (<meta name="tag" content={tag.name} />)
        })
        const songTags = song.sub_genres.map(tag => {
          return (
              <span key={tag.id} className="tag">#{tag.name}</span>
          )
        })
        return (
            <div id={song.slug} className="songContainer" key={`${song.id}`}>
            <Helmet>
              <title>Rock With This - {song.name} by {song.name}</title>
              <meta name="song" content={song.name} />
              <meta name="artist" content={song.artist_name} />
              <meta name="description" content={song.description} />
              <meta name="og:image" content={song.image_url} />
              <meta property="og:image:width"  content="300" />
              <meta property="og:image:height" content="300" />
              {songTagsMeta}
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Helmet>
            <div className="wrapper">
                <div className="imageContainer">
                  <img className="songImage" src={song.image_url} />
                  <div className="songImageInfoContainer">
                  {this.renderPlayer()}
                    <div className="song-info">
                        <p className="song-title">{song.name}</p>
                        <p className="song-artist">{song.artist_name}</p>
                    </div>
                    <a target="_blank" href={song.spotify_link} className="spotify-mobile"><i className="fa fa-spotify" aria-hidden="true" /></a>
                  </div>
                </div>
                <div className="postContent" >

                <div>
                    <div className="songInfo">
                    <div className="topSection">
                    {this.renderPlayer()}
                    <div className="singleSongInfo">
                      <div className="songNameContainer">  <span className="songName">{song.name}</span><a target="_blank" href={song.spotify_link} className="spotify"><i className="fa fa-spotify" aria-hidden="true" /></a></div> <br />
                      <div className="artistNameContainer">  <span className="artistName">{song.artist_name}</span> </div>
                    </div>
                    </div>
                        <div className="metaInfo">
                        <p className="leftInfo desktop">
                        <span className="postDate "><Moment format="ll" date={song.created_at} /> | <span className="postAuthor">Jared Paul</span> | </span>
                        </p>
                        <p className="leftInfo mobile">
                        <span className="postDate "><Moment format="M/d/YY" date={song.created_at} /> | <span className="postAuthor">Jared Paul</span> | </span>
                        </p>
                        <span className="postTags">{songTags}</span>

                            {song ? <ShareBox song={song} /> : <div></div>  }
                        </div>



                    </div>
                </div>
                    {this.renderDescription()}
                </div>
            </div>
          </div>
        )
    }
}

SingleSong.propTypes = {
    singleSong: PropTypes.object.isRequired,
    toggleSong: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    activeSong: PropTypes.object,
}

SingleSong.defaultProps = {
    activeSong: {},
}

export default SingleSong
