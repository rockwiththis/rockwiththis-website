import { combineReducers } from 'redux'
import update from 'react-addons-update'
import { handleActions } from 'redux-actions'

import { FULL_VIEW } from 'constants/discover-views';

import fetchSongsReducers from './fetch/songs';
import fetchGenresReducers from './fetch/genres';
import setStateReducers from './set-state';
import playerReducers from './player';

// TODO split this out to imported reducers
const INITIAL_STATE = {
  shrinkHeader: false,
  isPlaying: false,
  discoverLayout: FULL_VIEW,
  fullHeightPlayer: false,
  activeSong: {},
  activeSongProgress: {
    playedRatio: 0,
    playedSeconds: 0,
  },
  heroPosts: [],
  filteredPosts: [],
  spotlightPost: {},
  singleSongPost: {},
  relatedSongs: [],
  genres: {},
  selectedGenreFilters: {},
  currentSongListPageIndex: 0,
  maxSongListPageIndex: 0,
  songListSize: 16,
  heroSongCount: 7,
  songPlayerDurations: {},
  loadingSongs: false,
  isShuffle: false,
  shouldLoadPlayers: false,
  shouldPrioritizePlayers: false,
  error: null
}

const appReducers = handleActions(
  {
    ...fetchSongsReducers,
    ...fetchGenresReducers,
    ...setStateReducers,
    ...playerReducers
  },
  INITIAL_STATE
)

export default appReducers
