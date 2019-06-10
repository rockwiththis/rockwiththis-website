import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Headers from './headers/index';
import NewestSongs from 'components/newest-songs';
import NewestSongsPlaceholder from 'components/newest-songs/placeholder';
// import DiscoverSection from 'components/discover';
// import AutoplayErrorModal from 'components/autoplay-error-modal';

import { setInitialSongs } from 'actions/fetch/songs';
import { didAutoplayFail } from 'actions/set-state';

class Homepage extends Component {

  componentWillMount = () => {
    if (this.props.showAutoplayModal)
      this.props.didAutoplayFail(true);
  }

  componentDidMount = () =>
    this.props.setInitialSongs();

  render = () => (
      <div className="homeContainer">
        <Headers />

        <NewestSongs
          newestSongPosts={this.props.newestSongPosts}
          getSongPlayStatus={() => "NO_STATUS"}
          getSongPlayerFunctions={() => ({})}
        />

        {/*
        <DiscoverSection />

        <AutoplayErrorModal showModalOverride={this.props.showAutoplayModal} />
        */}
      </div>
  );
}

/* TODO rename store props */
export default connect(
  ({ filteredPosts, heroPosts }) => ({
    songData: filteredPosts,
    newestSongPosts: heroPosts
  }),
  { setInitialSongs, didAutoplayFail }
)(Homepage)
