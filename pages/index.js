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

import { songDataShape, genresShape, songPlayerDataShape } from 'constants/prop-shapes';
import getSongPlayer from 'util/get-song-player';

import { setInitialSongs, loadMoreSongs, resetSongs } from 'actions/fetch/songs';
import { fetchGenres } from 'actions/fetch/genres';
import { didAutoplayFail, updateSpotlightSong } from 'actions/set-state';
import { playSong, pauseSong } from 'actions/player';

class Homepage extends Component {

  static propTypes = {
    setIsScrollDisabled: PropTypes.func.isRequired,

    // from redux
    setInitialSongs: PropTypes.func.isRequired,
    setDidAutoplayFail: PropTypes.func.isRequired,
    songData: PropTypes.exact(songDataShape).isRequired,
    genres: PropTypes.exact(genresShape).isRequired,
    playerData: PropTypes.exact(songPlayerDataShape).isRequired
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
      this.props.setDidAutoplayFail(true);
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

  getSongPlayers = songs =>
    songs.reduce((players, song) => ({
      ...players,
      [song.id]: getSongPlayer(song, this.props.playerData)
    }), {});

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
            songPlayers={this.getSongPlayers(this.props.songData.newest)}
            ref={this.newestSongsRef}
          />

          <DiscoverSection
            scroll={this.scrollControls()}
            songData={this.props.songData}
            songPlayers={this.getSongPlayers(this.props.songData.all)}
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
  isShuffle,
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
    areShuffled: isShuffle,
    all: Array.from((new Set(filteredPosts)).add(spotlightPost)).filter(s => !!s.id)
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
  setDidAutoplayFail: didAutoplayFail,
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
  playerData: {
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
