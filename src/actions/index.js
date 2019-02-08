import { createAction } from 'redux-actions'

const API_BASE_URL =
  process.env.NODE_ENV == 'development' ?
    'http://localhost:9292/api' :
    '/api';

const LOADING_MORE_SONGS = createAction('app/LOADING_MORE_SONGS');
const LOADED_MORE_SONGS = createAction('app/LOADED_MORE_SONGS');
const LOAD_SONGS_FAILED = createAction('app/LOAD_SONGS_FAILED');
export const loadMoreSongs = ({ updateSpotlight = false } = {}) => (dispatch, getState) => {
  const state = getState();
  const filterIds = state.selectedFilters.map(filter => filter.id)
  const fullURL =
    `${API_BASE_URL}/songs?` +
    `offset=${state.filteredPosts.length}&` +
    `tags=[${filterIds}]`;

  dispatch(LOADING_MORE_SONGS());
  return fetch(fullURL)
    .then(res => res.json())
    .then(newSongList => {
      if (newSongList.length === 0) return;
      dispatch(LOADED_MORE_SONGS({ newSongList, updateSpotlight }));
    })
    .catch(e => dispatch(LOAD_SONGS_FAILED({ errorMessage: e.message })));
}

export const updateSpotlightSong = newSpotlightSong =>
  createAction('app/UPDATE_SPOTLIGHT_SONG')({ newSpotlightSong });

export const playSong = song =>
  createAction('app/PLAY_SONG')({ song });

export const playActiveSong = createAction('app/PLAY_ACTIVE_SONG');

export const pauseSong = createAction('app/PAUSE_SONG');
