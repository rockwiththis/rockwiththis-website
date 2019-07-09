import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { loadSingleSong } from 'actions/fetch/songs';

import SingleSongPost from 'components/song-post';
import RelatedSongs from 'components/song-post/related-songs';

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

  componentWillMount = () =>
    this.props.loadSingleSong(this.getSongId());

  render = () => (
      <div className="single-song-page">
        <SongPost
          songData={this.props.singleSong}
          songPlayStatus="TODO"
          songPlayerFunctions={{}}
        />
        <RelatedSongs relatedSongsData={this.props.relatedSongs} />
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
