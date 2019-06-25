import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HOME } from 'constants/page-names';

import Head from './head-content/index';
import Header from 'components/header';
import NewestSongs from 'components/newest-songs';
import NewestSongsPlaceholder from 'components/newest-songs/placeholder';
import DiscoverSection from 'components/discover';
// import AutoplayErrorModal from 'components/autoplay-error-modal';

import { setInitialSongs } from 'actions/fetch/songs';
import { didAutoplayFail } from 'actions/set-state';

class Homepage extends Component {

  static propTypes = {
    setIsScrollDisabled: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      scrolledToDiscover: false
    }
  }

  componentWillMount = () => {
    if (this.props.showAutoplayModal)
      this.props.didAutoplayFail(true);
  }

  componentDidMount = () => {
    this.props.setInitialSongs();
    window.addEventListener('scroll', this.updateScrolledToDiscover)
    window.addEventListener('resize', this.updateScrolledToDiscover)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.updateScrolledToDiscover)
    window.removeEventListener('resize', this.updateScrolledToDiscover)
  }

  getNewestSongsElement = () => document.getElementById('newest-songns');

  // TODO better scroll anchoring + control
  updateScrolledToDiscover = () => {
    const newestSongsElement = this.getNewestSongsElement();
    const scrolledToDiscover = (
      newestSongsElement &&
      newestSongsElement.clientHeight + 45 > window.scrollY
    );
    this.setState({ scrolledToDiscover })
  }

  scrollToDiscover = () => {
    const newestSongsElement = this.getNewestSongsElement();
    if (!!newestSongsElement)
      animateScroll.scrollTo(newestSongsElement.clientHeight + 45);
  }

  scrollToTop = () => {
    this.setState({ scrolledToDiscover: false });
    animateScroll.scrollTo(0);
  }

  scrollControls = () => ({
    scrolledToDiscover: this.state.scrolledToDiscover,
    scrollToDiscover: this.scrollToDiscover,
    scrollToTop: this.scrollToTop,
    setIsScrollDisabled: this.props.setIsScrollDisabled
  })

  render = () => (
      <div className="homeContainer">
        <Head />

        {/* TODO make this explicitly a `HomeHeader` */}
        <Header
          pageName={HOME}
          scroll={this.scrollControls()}
        />

        <div className="content">
          <NewestSongs
            newestSongPosts={this.props.newestSongPosts}
            getSongPlayStatus={() => "NO_STATUS"}
            getSongPlayerFunctions={() => ({})}
          />

          <DiscoverSection
            scroll={this.scrollControls()}

          />

          {/*
          <AutoplayErrorModal showModalOverride={this.props.showAutoplayModal} />
          */}
        </div>
        <style jsx>{`
          .content {
            max-width: 1658px;
            margin: 0 auto;
          }
        `}</style>
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
