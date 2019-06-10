import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Headers from './headers/index';
import HeroPosts from 'components/HeroGrid/HeroPosts';
import DiscoverSection from 'components/discover';
import AutoplayErrorModal from 'components/autoplay-error-modal';

import { setInitialSongs } from 'actions/fetch/songs';
import { didAutoplayFail } from 'actions/set-state';

class Homepage extends Component {

  static getInitialProps({store}) {
    if (this.props.songs.length === 0)
      this.props.setInitialSongs();

    if (this.props.showAutoplayModal)
      this.props.didAutoplayFail(true);
  }

  render = () => (
      <div className="homeContainer">
        <Headers />

        <HeroPosts
          {...this.props}
          heroPosts={this.props.heroPosts}
        />

        <DiscoverSection />

        <AutoplayErrorModal showModalOverride={this.props.showAutoplayModal} />
      </div>
  );
}

export default connect(
  ({ filteredPosts }) => ({ songs: filteredPosts }),
  { setInitialSongs, didAutoplayFail }
)(Homepage)
