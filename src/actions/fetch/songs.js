import { createAction } from 'redux-actions'

const API_BASE_URL =
  process.env.NODE_ENV == 'development' ?
    'http://localhost:9292/api' :
    '/api';

const fetchSongs = (state, isShuffle = false) => {
  const subgenreFilterIds = state.selectedFilters.map(filter => filter.id);
  const currSongIds = state.filteredPosts.map(song => song.id);
  const fullURL =
    `${API_BASE_URL}/songs/${isShuffle ? 'shuffle' : ''}?` +
    `tags=[${subgenreFilterIds}]&` +
    `omitSongIds=[${currSongIds}]`;

  return fetch(fullURL).then(res => res.json());
}

const LOADING_SONGS = createAction('app/LOADING_SONGS');
const LOAD_SONGS_FAILED = createAction('app/LOAD_SONGS_FAILED');

const RESET_SONGS = createAction('app/RESET_SONGS');
export const loadFirstSongs = ({ isShuffle = false } = {}) => (dispatch, getState) =>
  dispatch(LOADING_SONGS())
    .then(() => fetchSongs(getState(), isShuffle))
    .then(fetchedSongs => (
      fetchedSongs.length === 0 ?
        dispatch(LOAD_SONGS_FAILED({ errorMessage: 'Fetched empty list of songs' })) :
        dispatch(RESET_SONGS({ songs: fetchedSongs, isShuffle }))
    ))
    .catch(e => dispatch(LOAD_SONGS_FAILED({ errorMessage: e.message })));

const LOADED_MORE_SONGS = createAction('app/LOADED_MORE_SONGS');
export const loadMoreSongs = ({ updateSpotlight = false } = {}) => (dispatch, getState) =>
  dispatch(LOADING_SONGS())
    .then(() => fetchSongs(getState()))
    .then(fetchedSongs => (
      fetchedSongs.length === 0 ?
        dispatch(LOAD_SONGS_FAILED({ errorMessage: 'Fetched empty list of songs' })) :
        dispatch(LOADED_MORE_SONGS({ newSongs: fetchedSongs, updateSpotlight }))
    ))
    .catch(e => dispatch(LOAD_SONGS_FAILED({ errorMessage: e.message })));
