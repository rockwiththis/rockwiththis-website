import { combineReducers } from 'redux'
import update from 'react-addons-update'
import { handleActions } from 'redux-actions'

import { FULL_VIEW } from 'constants/discover-views';

import fetchSongsReducers from './fetch/songs';
import fetchGenresReducers from './fetch/genres';
import setStateReducers from './set-state';
import playerReducers from './player';
import scrollReducers from './scroll';

// TODO split this out to imported reducers
const INITIAL_STATE = {
  shrinkHeader: false,
  isPlaying: false,
  discoverLayout: FULL_VIEW,
  fullHeightPlayer: false,
  activeSong: {},
  activeSongProgress: {
    playedRatio: 0,
    secondsPlayed: 0,
  },
  heroPosts: [],
  filteredPosts: [],
  spotlightPost: {},
  singlePageSongPost: {},
  relatedSongs: [],
  filters: [],
  genres: {},
  genreFilters: [],
  subgenreFilters: [],
  selectedFilters: [],
  currentSongListPageIndex: 0,
  maxSongListPageIndex: 0,
  songListSize: 16,
  heroSongCount: 7,
  songPlayerDurations: {},
  shouldLoadPlayers: false,
  loadingSongs: false,
  isShuffle: false
}

const appReducers = handleActions({

  'app/PLAYER_BANK_UPDATED': (state, action) => {
    return update(state, { shouldLoadPlayers: { $set: false } });
  },

  // TODO we need a better way of indicating loaded player
  // Using this scheme, once a player is loaded, app will never "unload" it
  'app/PLAYER_LOADED': (state, action) => {
    return update(state, {
      songPlayerDurations: { $set: {
        ...state.songPlayerDurations,
        [action.payload.songId]: action.payload.durationSeconds
      }}
    })
  },
  'app/FETCH_SINGLE_SONG': (state, action) => {
    return update(state, {
      singleSong: { $set: action.payload },
      activeSong: { $set: !!state.activeSong.id ? state.activeSong : action.payload },
      shouldLoadPlayers: { $set: true }
    })
  },
  'app/CLEAR_SINGLE_SONG': (state, action) => {
    return update(state, {
      singleSong: { $set: {} }
    })
  },
  'app/SET_SONG_PROGRESS': (state, action) => {
    return update(state, {
      activeSongProgress: { $set: action.payload }
    })
  },
  'app/SET_RELATED_SONGS': (state, action) => {
    return update(state, {
      relatedSongs: { $set: action.payload }
    })
  },
  ...fetchSongsReducers,
  ...fetchGenresReducers,
  ...setStateReducers,
  ...playerReducers,
  ...scrollReducers
}, INITIAL_STATE)

export default appReducers
