import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { SONG } from 'constants/page-names';

import HeadContent from '../head-content/single-song';
import Header from 'components/header';
import SongPost from 'components/song-post';
import RelatedSongs from 'components/song-post/related-songs';

import { loadSingleSong } from 'actions/fetch/songs';

class SingleSongPage extends Component {

  static propTypes = {
    singleSong: PropTypes.object.isRequired,
    relatedSongs: PropTypes.array.isRequired,
    loadSingleSong: PropTypes.func.isRequired,
    router: PropTypes.shape({
      query: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  getSongId = () => parseInt(this.props.router.query.id);

  // TODO enable fetching on server
  componentDidMount = () =>
    this.props.loadSingleSong(this.getSongId());

  render = () => (
      <div className="single-song-page">
        { !!this.props.singleSong.id ?
            <Fragment>
              <HeadContent songData={this.props.singleSong} />

              <Header pageName={SONG} />

              <div className="content">
                <SongPost
                  songData={this.props.singleSong}
                  songPlayStatus="TODO"
                  songPlayerFunctions={{}}
                />
                <RelatedSongs relatedSongsData={this.props.relatedSongs} />
              </div>
            </Fragment>
            :
            <div className="single-song-placeholder"></div>
        }

        <style jsx>{`
          .content {
            height: calc(100vh - 70px - 75px);   // full screen height minus header + footer player
            max-width: 1658px;
            margin: 0 auto;
            margin-bottom: 70px;
            padding: 100px 35px 0;
            box-sizing: border-box;
          }
        `}</style>
        <style global jsx>{`
          .single-song-page .song-post {
            width: 86%;
            height: 100%;
            display: inline-block;
            vertical-align: top;
          }
          .single-song-page .song-post .song-image {
            width: 45%;
          }
          .single-song-page .song-header {
            width: 55%;
            height: 100px;
            margin-left: 45%;
            padding 0 25px;
            box-sizing: border-box;
          }
          .single-song-page .song-post-content {
            height: calc(100% - 100px);
            margin-left: 45%;
            padding 0 25px;
            box-sizing: border-box;
            overflow-y: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .single-song-page .song-post-content::-webkit-scrollbar {
            width: 0px;
          }
          .single-song-page .song-header {
            font-size: 19pt;
          }
          .single-song-page .song-post-content {
            font-size: 10.5pt;
            line-height: 28px;
            font-weight: 100;
          }
          .single-song-page .related-songs {
            width: 14%;
            display: inline-block;
          }
        `}</style>
      </div>
  );
}

export default withRouter(
  connect(
    ({ singleSongPost, relatedSongs }) => ({
      singleSong: singleSongPost,
      relatedSongs
    }),
    { loadSingleSong }
  )(SingleSongPage)
);
