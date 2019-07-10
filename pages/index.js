import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HOME } from 'constants/page-names';

import HeadContent from './head-content/index';
import Header from 'components/header';
import NewestSongs from 'components/newest-songs';
import NewestSongsPlaceholder from 'components/newest-songs/placeholder';
import DiscoverSection from 'components/discover';
// import AutoplayErrorModal from 'components/autoplay-error-modal';

import { setInitialSongs, loadMoreSongs, resetSongs } from 'actions/fetch/songs';
import { fetchGenres } from 'actions/fetch/genres';
import { didAutoplayFail, updateSpotlightSong } from 'actions/set-state';

class Homepage extends Component {

  static propTypes = {
    // TODO
    setIsScrollDisabled: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.newestSongsRef = React.createRef();
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
    this.props.fetchGenres();
    window.addEventListener('scroll', this.updateScrolledToDiscover)
    window.addEventListener('resize', this.updateScrolledToDiscover)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.updateScrolledToDiscover)
    window.removeEventListener('resize', this.updateScrolledToDiscover)
  }

  // TODO better scroll anchoring + control
  updateScrolledToDiscover = () =>
    this.setState({
      scrolledToDiscover:
        this.newestSongsRef.current.getClientHeight() + 45 > window.scrollY
    })

  // TODO replace `75` w/ toolbar height
  scrollToDiscover = () =>
    window.scrollTo(0, this.newestSongsRef.current.getClientHeight() + 75);

  scrollToTop = () => {
    this.setState({ scrolledToDiscover: false });
    window.scrollTo(0, 0);
  }

  scrollControls = () => ({
    scrolledToDiscover: this.state.scrolledToDiscover,
    scrollToDiscover: this.scrollToDiscover,
    scrollToTop: this.scrollToTop,
    setIsScrollDisabled: this.props.setIsScrollDisabled
  })

  render = () => (
      <div className="homepage">
        <HeadContent />

        {/* TODO make this explicitly a `HomeHeader` */}
        <Header
          pageName={HOME}
          scroll={this.scrollControls()}
        />

        <div className="content">
          <NewestSongs
            newestSongPosts={this.props.songData.newest}
            songPlayStatusForSong={() => "NO_STATUS"}
            songPlayerFunctionsForSong={() => ({})}
            ref={this.newestSongsRef}
          />

          <DiscoverSection
            scroll={this.scrollControls()}
            songPosts={this.props.songData}
            songPlayStatusForSong={() => "NO_STATUS"}
            songPlayerFunctionsForSong={() => ({})}
            songDataFunctions={this.props.songDataFunctions}
            genres={this.props.genres}
          />

          {/*
          <AutoplayErrorModal showModalOverride={this.props.showAutoplayModal} />
          */}
        </div>
        <style jsx>{`
          .content {
            max-width: 1658px;
            margin: 0 auto;
            margin-bottom: 70px;
          }
        `}</style>
      </div>
  );
}

/* TODO rename store props */
export default connect(
  ({
    heroPosts,
    filteredPosts,
    spotlightPost,
    loadingSongs,
    selectedGenreFilters,
    genres
  }) => ({
    songData: {
      newest: heroPosts,
      filtered: filteredPosts,
      spotlight: spotlightPost
    },
    isLoadingSongs: loadingSongs,
    genres: {
      available: genres,
      filters: selectedGenreFilters
    }
  }),
  {
    setInitialSongs,
    didAutoplayFail,
    loadMoreSongs,
    resetSongs,
    updateSpotlightSong,
    fetchGenres
  },
  // TODO maybe define these aggregated collections in actions instead
  ({
    songData,
    isLoadingSongs,
    genres
  }, {
    setInitialSongs,
    didAutoplayFail,
    loadMoreSongs,
    resetSongs,
    updateSpotlightSong,
    fetchGenres
  }, ownProps) => ({
    ...ownProps,
    songData,
    genres,
    setInitialSongs,
    didAutoplayFail,
    fetchGenres,
    songDataFunctions: {
      loadMore: loadMoreSongs,
      resetSongs: resetSongs,
      setSpotlight: updateSpotlightSong,
      isLoading: isLoadingSongs
    }
  })
)(Homepage)
