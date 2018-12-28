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
    played: 0,
    secondsPlayed: 0,
  },
  posts: [],
  filteredPosts: [],
  queue: [],
  relatedSongs: [],
  filters: [],
  selectedFilters: [],
  currentlyFetchedPageNumber: 0
}

const appReducers = handleActions({
  'app/FETCH_POSTS': (state, action) => {
    return update(state, {
      posts: { $set: action.payload },
      filteredPosts: { $set: action.payload },
      activeSong: { $set: action.payload[0] }
    })
  },
  'app/SET_REMAINING_POSTS': (state, action) => {
    return state
    return update(state, {
      filteredPosts: { $set: [...state.posts, ...action.payload] }
    })
  },
  'app/FETCH_CURRENT_REQUEST': (state, action) => {
    return update(state, {
      filteredPosts: { $set: action.payload }
    })
  },
  'app/CURRENT_REQUEST_LOADING': (state, action) => {
    return update(state, {
      currentRequestLoading: { $set: action.payload }
    })
  },
  'app/LOAD_MORE_SONGS': (state, action) => {
    return update(state, {
      filteredPosts: { $set: [...state.filteredPosts, ...action.payload]}
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
  'app/SET_SONG_DURATION': (state, action) => {
    return update(state, {
      activeSongDuration: { $set: action.payload }
    })
  },
  'app/SET_RELATED_SONGS': (state, action) => {
    return update(state, {
      relatedSongs: { $set: action.payload }
    })
  },
  'app/TOGGLE_PLAY_PAUSE': (state, action) => {
    return update(state, {
      isPlaying: { $set: action.payload}
    })
  },
  'app/TOGGLE_SONG': (state, action) => {
    return update(state, {
      activeSong: { $set: action.payload }
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

const currentlyFetchedPageNumber = (state = 0, action) => {
    switch (action.type) {
    case FETCH_POSTS.SUCCESS:
        return action.pageNumber + 1
    default:
        return state
    }
}

export default appReducers

// export default combineReducers({
//     appReducers,
//     queue,
//     featuredPosts,
//     filters,
//     singleSong,
//     relatedSongs,
//     currentlyFetchedPageNumber,
//     discoverLayout
// })
