import { createAction } from 'redux-actions'
import { map } from 'lodash';

const API_BASE_URL =
  process.env.NODE_ENV == 'development' ?
    'http://localhost:9292/api' :
    '/api';

const getIds = array => array && map(array, x => x.id);

const fetchSongs = (
  state,
  omitCurrSongs,
  isShuffle = state.isShuffle,
  subgenreIds = getIds(state.subgenreFilterIds)
) => {
  const subgenreFilterIds = state.selectedFilters.map(filter => filter.id);
  const currSongIds = state.filteredPosts.map(song => song.id);
  const fullURL =
    `${API_BASE_URL}/songs/${isShuffle ? 'shuffle' : ''}?` +
    `tags=[${subgenreIds}]` +
    (omitCurrSongs ? `&omitSongIds=[${currSongIds}]` : '');

  return fetch(fullURL).then(res => res.json());
}

const LOADING_SONGS = createAction('app/LOADING_SONGS');
const LOAD_SONGS_FAILED = createAction('app/LOAD_SONGS_FAILED');

const RESET_SONGS = createAction('app/RESET_SONGS');
export const resetSongs = ({ isShuffle, subgenreFilters } = {}) => (dispatch, getState) => {
  dispatch(LOADING_SONGS());
  return fetchSongs(getState(), false, isShuffle, getIds(subgenreFilters))
    .then(fetchedSongs => (
      fetchedSongs.length === 0 ?
        dispatch(LOAD_SONGS_FAILED({ errorMessage: 'Fetched empty list of songs' })) :
        dispatch(RESET_SONGS({ songs: fetchedSongs, isShuffle, subgenreFilters }))
    ))
    .catch(e => dispatch(LOAD_SONGS_FAILED({ errorMessage: e.message })));
}

const SET_INITIAL_SONGS = createAction('app/SET_INITIAL_SONGS');
export const setInitialSongs = () => (dispatch, getState) => {
  dispatch(LOADING_SONGS());
  return fetchSongs(getState(), false)
    .then(fetchedSongs => (
      fetchedSongs.length === 0 ?
        dispatch(LOAD_SONGS_FAILED({ errorMessage: 'Fetched empty list of songs' })) :
        dispatch(SET_INITIAL_SONGS({ songs: fetchedSongs }))
    ))
    .catch(e => dispatch(LOAD_SONGS_FAILED({ errorMessage: e.message })));
}

const LOADED_MORE_SONGS = createAction('app/LOADED_MORE_SONGS');
export const loadMoreSongs = ({ updateSpotlight = false } = {}) => (dispatch, getState) => {
  dispatch(LOADING_SONGS());
  return fetchSongs(getState(), true)
    .then(fetchedSongs => {
      fetchedSongs.length === 0 ?
        dispatch(LOAD_SONGS_FAILED({ errorMessage: 'Fetched empty list of songs' })) :
        dispatch(LOADED_MORE_SONGS({ newSongs: fetchedSongs, updateSpotlight }))

      return fetchedSongs;
    })
    .catch(e => dispatch(LOAD_SONGS_FAILED({ errorMessage: e.message })));
}
