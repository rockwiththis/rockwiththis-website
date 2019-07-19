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

import { songDataPropTypes, genresPropTypes } from 'constants/prop-types';
import getSongStatus from 'util/get-song-status';

import { setInitialSongs, loadMoreSongs, resetSongs } from 'actions/fetch/songs';
import { fetchGenres } from 'actions/fetch/genres';
import { didAutoplayFail, updateSpotlightSong } from 'actions/set-state';
import { playSong, pauseSong } from 'actions/player';

class Homepage extends Component {

  static propTypes = {
    setIsScrollDisabled: PropTypes.func.isRequired,

    // from redux
    setInitialSongs: PropTypes.func.isRequired,
    didAutoplayFail: PropTypes.bool,
    songData: songDataPropTypes.isRequired,
    genres: genresPropTypes.isRequired,
    player: PropTypes.exact({
      activeSong: PropTypes.object.isRequired,
      isPlaying: PropTypes.bool.isRequired,
      songPlayerDurations: PropTypes.object.isRequired,
      playSong: PropTypes.func.isRequired,
      pauseSong: PropTypes.func.isRequired
    }).isRequired
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
    this.props.genres.fetch();
    window.addEventListener('scroll', this.updateScrolledToDiscover)
    window.addEventListener('resize', this.updateScrolledToDiscover)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.updateScrolledToDiscover)
    window.removeEventListener('resize', this.updateScrolledToDiscover)
  }

  updateScrolledToDiscover = () =>
    this.setState({
      scrolledToDiscover:
        window.scrollY >= this.newestSongsRef.current.getClientHeight()
    })

  scrollToDiscover = () =>
    window.scrollTo(0, this.newestSongsRef.current.getClientHeight());

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

  getSongPlayer = song => ({
    status: () => getSongStatus(song, this.props.player),
    play: () => this.props.player.playSong(song),
    pause: () => this.props.player.pauseSong()
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
            songPlayers={this.getSongPlayer}
            ref={this.newestSongsRef}
          />

          <DiscoverSection
            scroll={this.scrollControls()}
            songData={this.props.songData}
            songPlayers={this.getSongPlayer}
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
            padding-top: 75px;
            padding-bottom: 75px;
            box-sizing: border-box;
          }
        `}</style>
      </div>
  );
}

const stateToProps = ({
  heroPosts,
  filteredPosts,
  spotlightPost,
  isShuffled,
  selectedGenreFilters,
  genres,
  loadingSongs,
  isPlaying,
  songPlayerDurations,
  activeSong
}) => ({
  songData: {
    newest: heroPosts,
    filtered: filteredPosts,
    spotlight: spotlightPost,
    areShuffled: isShuffled
  },
  genres: {
    available: genres,
    filters: selectedGenreFilters
  },
  isLoadingSongs: loadingSongs,
  isPlaying,
  songPlayerDurations,
  activeSong
});

const actions = {
  setInitialSongs,
  didAutoplayFail,
  loadMoreSongs,
  resetSongs,
  updateSpotlightSong,
  fetchGenres,
  playSong,
  pauseSong
}

const buildProps = (
  { // state props
    songData,
    genres,
    isLoadingSongs,
    isPlaying,
    activeSong,
    songPlayerDurations
  },
  { // action props
    setInitialSongs,
    didAutoplayFail,
    loadMoreSongs,
    resetSongs,
    updateSpotlightSong,
    fetchGenres,
    playSong,
    pauseSong
  },
  ownProps
) => ({
  ...ownProps,
  setInitialSongs,
  didAutoplayFail,
  genres: {
    ...genres,
    fetch: fetchGenres
  },
  songData: {
    ...songData,
    loadMore: loadMoreSongs,
    resetSongs: resetSongs,
    setSpotlight: updateSpotlightSong,
    isLoading: isLoadingSongs
  },
  player: {
    activeSong,
    isPlaying,
    songPlayerDurations,
    playSong,
    pauseSong
  }
})

export default connect(
  stateToProps,
  actions,
  buildProps
)(Homepage)
