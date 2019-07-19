import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { SONG } from 'constants/page-names';

import HeadContent from '../head-content/single-song';
import Header from 'components/header';
import Desktop from 'components/single-song/desktop';
import Mobile from 'components/single-song/mobile';

import { loadSingleSong } from 'actions/fetch/songs';

class SingleSongPage extends Component {

  static propTypes = {
    singleSongData: PropTypes.object.isRequired,
    loadSingleSong: PropTypes.func.isRequired,
    relatedSongs: PropTypes.array.isRequired,
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
        <HeadContent songData={this.props.singleSong} />

        <Header pageName={SONG} />

        <div className="content">
          <Desktop {...this.props} />
          <Mobile {...this.props} />
        </div>

        <style jsx>{`
          .content {
            height: calc(100vh - 70px - 75px);   // full screen height minus header + footer player
            max-width: 1658px;
            margin: 0 auto;
            margin-bottom: 70px;
            padding: 100px 35px 0;
            box-sizing: border-box;
          }
          @media (max-width: 800px) {
            .content {
              padding: 75px 0 0;
            }
        `}</style>
        <style jsx global>{`
          @media (min-width: 800px) {
            .single-song-page .single-song-mobile {
              display: none
            }
          }
          @media (max-width: 800px) {
            .single-song-page .single-song-desktop {
              display: none
            }
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
