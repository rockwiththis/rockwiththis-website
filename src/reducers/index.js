import { combineReducers } from 'redux'
import update from 'react-addons-update'
import { handleActions } from 'redux-actions'

import { expectPayloadValue } from './util';
import fetchSongsReducers from './fetch/songs';

const INITIAL_STATE = {
  shrinkHeader: false,
  isPlaying: false,
  discoverLayout: 'expanded',
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
  'app/SET_FILTERED_SONG_LIST': (state, action) => {
    return update(state, {
      filteredPosts: { $set: action.payload },
      spotlightPost: { $set: action.payload[0] },
      currentSongListPageIndex: { $set: 0 },
      maxSongListPageIndex: { $set: 0 },
      shouldLoadPlayers: { $set: true }
    })
  },
  'app/SET_LOADING_STATUS': (state, action) => {
    return update(state, {
      currentRequestLoading: { $set: action.payload }
    })
  },
  'app/LOAD_NEXT_SONGS': (state, action) => {
    const newPageIndex = state.currentSongListPageIndex + 1;
    const startPostIndex = newPageIndex * state.songListSize;
    const endPostIndex = startPostIndex + state.songListSize;
    const newSongList = state.filteredPosts.slice(startPostIndex, endPostIndex);
    return update(state, {
      currentSongListPageIndex: { $set: newPageIndex },
      shouldLoadPlayers: { $set: true },
      spotlightPost: {
        $set: action.payload.updateSpotlight ?
          action.payload.newSongList[0] :
          state.spotlightPost
      }
    })
  },
  'app/LOAD_PREVIOUS_SONGS': (state, action) => {
    const newPageIndex = state.currentSongListPageIndex - 1;
    if (newPageIndex >= 0) {
      const startPostIndex = newPageIndex * state.songListSize;
      const endPostIndex = startPostIndex + state.songListSize;
      const newSongList = state.filteredPosts.slice(startPostIndex, endPostIndex);
      return update(state, {
        currentSongListPageIndex: { $set: newPageIndex },
        shouldLoadPlayers: { $set: true },
        spotlightPost: {
          $set: action.payload.updateSpotlight ?
            newSongList.slice(-1).pop() :
            state.spotlightPost
        }
      })
    } else {
      return state
    }
  },

  'app/UPDATE_SPOTLIGHT_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'newSpotlightSong', 'UPDATE_SPOTLIGHT_SONG');

    return {
      ...state,
      spotlightPost: action.payload.newSpotlightSong
    };
  },

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
  'app/PAUSE_SONG': (state, action) => ({
    ...state,
    isPlaying: false
  }),
  'app/PLAY_ACTIVE_SONG': (state, action) => ({
    ...state,
    isPlaying: true
  }),
  'app/PLAY_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'song', 'PLAY_SONG');

    return {
      ...state,
      activeSong: action.payload.song,
      isPlaying: true,
      activeSongDuration: state.songPlayerDurations[action.payload.song.id],
      activeSongProgress: {
        playedRatio: 0,
        secondsPlayed: 0,
      }
    };
  },
  'app/CHANGE_GRID_VIEW': (state, action) => {
    return update(state, {
      discoverLayout: { $set: action.payload }
    })
  },
  'app/FETCH_FILTERS': (state, action) => {
    console.log("action.payload");
    console.log(action.payload);
    return update(state, {
      filters: { $set: action.payload.subgenres }
    })
  },
  'app/TOGGLE_FILTER': (state, action) => {
    const filters = state.filters
    console.log("filters", filters);
    console.log(action.payload.i);
    filters[action.payload.i].selected = !filters[action.payload.i].selected

    const selectedFilters = filters.filter(filter => filter.selected === true)
    return update(state, {
      filters: { $set: filters },
      selectedFilters: { $set: selectedFilters}
    })
  },
  'app/CLEAR_FILTERS': (state, action) => {
    // const filters = state.filters.map(filter => {
    //   filter.selected = false
    //   return filter
    // })
    return update(state, {
      // filters: { $set: filters },
      filteredPosts: { $set: state.posts },
      selectedFilters: { $set: [] }
    })
  },
  'FETCH_FILTERS_SUCCESS': (state, action) => {
    return update(state, {
      filters: { $set: action.filters },
    })
  },
  ...fetchSongsReducers
}, INITIAL_STATE)

export default appReducers
