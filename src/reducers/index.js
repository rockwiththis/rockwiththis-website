import { combineReducers } from 'redux'
import { FETCH_POSTS } from '../actions/index'
import { FETCH_FILTERS } from '../actions/filters'
import { FETCH_RELATED_SONGS } from '../actions/relatedSongs'
import posts from './posts'
import queue from './queue'
import relatedSongs from './relatedSongs'
import filters from './filters'
import update from 'react-addons-update'
import { handleActions } from 'redux-actions'

export const INITIAL_STATE = {
  shrinkHeader: false,
  isPlaying: false,
  discoverLayout: 'expanded',
  fullHeightPlayer: false,
  activeSong: {
    better_featured_image: '',
    acf: {}
  },
  activeSongProgress: {
    playedRatio: 0,
    secondsPlayed: 0,
  },
  posts: [],
  filteredPosts: [],
  songListPosts: [],
  heroPosts: [],
  snapshotPost: {},
  singlePageSongPost: {},
  queue: [],
  relatedSongs: [],
  filters: [],
  selectedFilters: [],
  currentSongListPageIndex: 0,
  maxSongListPageIndex: 0,
  songListSize: 16,
  heroSongCount: 7,
  songPlayerDurations: {},
  shouldLoadPlayers: false
}

const appReducers = handleActions({
  'app/FETCH_POSTS': (state, action) => {
    console.log("Fetched posts!");
    console.log(action.payload);
    return update(state, {
      posts: { $set: action.payload },
      filteredPosts: { $set: action.payload },
      songListPosts: { $set: action.payload },
      snapshotPost: { $set: action.payload[0] },
      heroPosts: { $set: action.payload.slice(0, state.heroSongCount) },
      activeSong: { $set: action.payload[0] }
    })
  },
  'app/SET_REMAINING_POSTS': (state, action) => {
    // WTF??
    return state
    return update(state, {
      filteredPosts: { $set: [...state.posts, ...action.payload] }
    })
  },
  'app/SET_FILTERED_SONG_LIST': (state, action) => {
    return update(state, {
      filteredPosts: { $set: action.payload },
      songListPosts: { $set: action.payload.slice(0, state.songListSize) },
      snapshotPost: { $set: action.payload[0] },
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
  'app/LOAD_MORE_SONGS': (state, action) => {
    return update(state, {
      filteredPosts: { $set: [ ...state.filteredPosts, ...action.payload.newSongList ]},
      songListPosts: { $set: action.payload.newSongList },
      currentSongListPageIndex: { $set: state.currentSongListPageIndex + 1 },
      maxSongListPageIndex: { $set: state.currentSongListPageIndex + 1 },
      shouldLoadPlayers: { $set: true },
      snapshotPost: {
        $set: action.payload.updateSnapshot ?
          action.payload.newSongList[0] :
          state.snapshotPost
      }
    })
  },
  'app/LOAD_NEXT_SONGS': (state, action) => {
    const newPageIndex = state.currentSongListPageIndex + 1;
    const startPostIndex = newPageIndex * state.songListSize;
    const endPostIndex = startPostIndex + state.songListSize;
    const newSongList = state.filteredPosts.slice(startPostIndex, endPostIndex);
    return update(state, {
      songListPosts: { $set: newSongList },
      currentSongListPageIndex: { $set: newPageIndex },
      shouldLoadPlayers: { $set: true },
      snapshotPost: {
        $set: action.payload.updateSnapshot ?
          action.payload.newSongList[0] :
          state.snapshotPost
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
        songListPosts: { $set: newSongList },
        currentSongListPageIndex: { $set: newPageIndex },
        shouldLoadPlayers: { $set: true },
        snapshotPost: {
          $set: action.payload.updateSnapshot ?
            newSongList.slice(-1).pop() :
            state.snapshotPost
        }
      })
    } else {
      return state
    }
  },
  'app/UPDATE_SNAPSHOT_SONG': (state, action) => {
    return update(state, {
      snapshotPost: { $set: action.payload },
      activeSong: { $set: !!state.activeSong.id ? state.activeSong : action.payload }
    })
  },
  'app/PLAYER_BANK_UPDATED': (state, action) => {
    return update(state, { shouldLoadPlayers: { $set: false } });
  },
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
      singleSong: { $set: action.payload }
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
  'app/TOGGLE_PLAY_PAUSE': (state, action) => {
    return update(state, {
      isPlaying: { $set: action.payload }
    })
  },
  'app/TOGGLE_SONG': (state, action) => {
    return update(state, {
      activeSong: { $set: action.payload },
      isPlaying: { $set: true },
      activeSongDuration: { $set: state.songPlayerDurations[action.payload.id] },
      activeSongProgress: { $set: {
        playedRatio: 0,
        secondsPlayed: 0,
      }}
    })
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
  }
}, INITIAL_STATE)

export default appReducers
