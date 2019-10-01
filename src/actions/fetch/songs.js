import { createAction } from 'redux-actions'
import { values, flatten, get } from 'lodash';
import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV == 'development' ?
    'http://localhost:9292/api' :
    '/api';

// TODO duplicate at components/.../genre-filters
const getSubgenreIds = selectedGenreFilters =>
  flatten(values(selectedGenreFilters).map(genre => (
    values(genre.subgenres).filter(sg => !!sg).map(sg => sg.id)
  )));

const fetchSongs = (
  state,
  omitCurrSongs,
  isShuffle = state.isShuffle,
  subgenreIds = getSubgenreIds(state.genreFilters, state.subgenreFilters)
) => {
  const currSongIds = state.filteredPosts.map(song => song.id);
  const fullURL =
    `${API_BASE_URL}/songs/${isShuffle ? 'shuffle' : ''}?` +
    (subgenreIds ? `tags=[${subgenreIds}]&` : '') +
    (omitCurrSongs ? `omitSongIds=[${currSongIds}]` : '');

  return axios.get(fullURL).then(({ data }) => data);
}

const LOADING_SONGS = createAction('app/LOADING_SONGS');
const LOAD_SONGS_FAILED = createAction('app/LOAD_SONGS_FAILED');

const RESET_SONGS = createAction('app/RESET_SONGS');
const SET_IS_SHUFFLED = createAction('app/SET_IS_SHUFFLED');
export const resetSongs = ({ isShuffle = null, selectedGenreFilters } = {}) => (dispatch, getState) => {
  dispatch(LOADING_SONGS());
  if (isShuffle != null) dispatch(SET_IS_SHUFFLED(isShuffle))
  const state = getState();
  const subgenreIds = getSubgenreIds(selectedGenreFilters || state.selectedGenreFilters);

  return fetchSongs(state, false, isShuffle, subgenreIds)
    .then(fetchedSongs => (
      fetchedSongs.length === 0 ?
        dispatch(LOAD_SONGS_FAILED({ errorMessage: 'Fetched empty list of songs' })) :
        dispatch(RESET_SONGS({ songs: fetchedSongs, isShuffle, selectedGenreFilters }))
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

const SET_SINGLE_SONG = createAction('app/SET_SINGLE_SONG');
const SET_RELATED_SONGS = createAction('app/SET_RELATED_SONGS');
export const loadSingleSong = songId => (dispatch, getState) => {

  const loadedSingleSong = getState().filteredPosts[songId]
  if (!!loadedSingleSong) {
    dispatch(SET_SINGLE_SONG({ newSingleSong: loadedSingleSong }));
    return;

  } else {
    const songUrl = `${API_BASE_URL}/songs/${songId}`;
    return axios.get(songUrl)
      .then(({ data }) => {
        dispatch(SET_SINGLE_SONG({ newSingleSong: data }))

        const subgenreIds = data.sub_genres.map(s => s.id);
        const relatedSongsUrl = `${API_BASE_URL}/songs?tags=[${subgenreIds}]`;

        return axios.get(relatedSongsUrl)
      })
      .then(({ data }) => {
        dispatch(SET_RELATED_SONGS({ relatedSongs: data }));
      })
  }
}
