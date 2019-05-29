import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { playSong, pauseSong } from 'actions/player';

import ShareBox from 'components/ShareBox/ShareBox'
import OutlineSingleSongControls from 'components/buttons/single-song-controls/outline';

import './SingleSong.scss'

class SingleSong extends Component {

  static propTypes = {
    singleSong: PropTypes.object.isRequired,

    // Redux
    songPlayerDurations: PropTypes.object,
    isPlaying: PropTypes.bool.isRequired,
    activeSong: PropTypes.object
  }

  static defaultProps = {
    activeSong: {}
  }

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  // TODO eliminate duplicate @ Song.js
  parsedDescription = song => song.description.replace(/\n+/g, '<br />  ')

  render() {
    const { activeSong, isPlaying } = this.props;
    const song = this.props.singleSong;

    const songTagsMeta = song.sub_genres.map((tag, i) =>
      <meta name="tag" content={tag.name} key={i} />
    );
    const songTags = song.sub_genres.map(tag =>
      <span key={tag.id} className="tag">{tag.name}</span>
    );

    const songControls = (
      <OutlineSingleSongControls
        isPlaying={this.props.isPlaying}
        isActiveSong={this.props.singleSong.id === this.props.activeSong.id}
        isLoading={!this.props.songPlayerDurations[this.props.singleSong.id]}
        pauseSong={() => this.props.pauseSong(this.props.singleSong)}
        playSong={() => this.props.playSong(this.props.singleSong)}
      />
    );

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
                { songControls }

                <div className="song-info">
                  <p className="song-title">{song.name}</p>
                  <p className="song-artist">{song.artist_name}</p>
                </div>

                <a target="_blank" href={song.spotify_link} className="spotify-mobile">
                  <i className="fa fa-spotify" aria-hidden="true" />
                </a>
              </div>

            </div>

            <div className="postContent" >

              <div className="songInfo">

                <div className="topSection">
                  { songControls }

                  <div className="singleSongInfo">

                    <div className="songNameContainer">
                      <span className="songName">
                        {song.name}
                        &nbsp;
                        <a target="_blank" href={song.spotify_link} className="spotify">
                          <i className="fa fa-spotify" aria-hidden="true" />
                        </a>
                      </span>
                    </div>

                    <div className="artistNameContainer">
                      <span className="artistName">{song.artist_name}</span>
                    </div>
                  </div>
                </div>

                <div className="metaInfo">
                  <p className="leftInfo desktop">
                    <span className="postAuthor">
                      Curated by&nbsp;
                      <span className="curatorName">
                        {`${song.curator_first_name} ${song.curator_last_name}`}
                      </span>
                    </span>
                    &nbsp;
                    <span className="separater">|</span>
                    &nbsp;
                  </p>
                  <p className="leftInfo mobile">
                    <span className="postAuthor">
                      Curated by&nbsp;
                      <span className="curatorName">
                        {`${song.curator_first_name} ${song.curator_last_name}`}
                      </span>
                    </span>
                    &nbsp;
                    <span className="separater">|
                    </span>
                    &nbsp;
                  </p>

                  <span className="postTags">{songTags}</span>

                  { song ? <ShareBox song={song} /> : <div></div>  }
                </div>

              </div>

              <div className={`bottomContentContainer ${this.state.expanded ? 'expanded' : ''}`}>
                <p
                  className="songDescription"
                  dangerouslySetInnerHTML={{ __html: this.parsedDescription(this.props.singleSong) }}
                />
              </div>

            </div>

          </div>
        </div>
    )
  }
}

export default connect(
  ({ songPlayerDurations }) => ({ songPlayerDurations }),
  { playSong, pauseSong }
)(SingleSong)
