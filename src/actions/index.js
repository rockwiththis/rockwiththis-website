import { createAction } from 'redux-actions'

const API_BASE_URL =
  process.env.NODE_ENV == 'development' ?
    'http://localhost:9292/api' :
    '/api'

const LOAD_MORE_SONGS = createAction('app/LOAD_MORE_SONGS');
export const loadMoreSongs = ({ updateSpotlight = false }) => (dispatch, getState) => {
  const state = getState();
  const filterIds = state.selectedFilters.map(filter => filter.id)
  const fullURL =
    `${API_BASE_URL}/songs?` +
    `offset=${state.filteredPosts.length}&` +
    `tags=[${filterIds}]`

  return fetch(fullURL)
    .then(res => res.json())
    .then(newSongList => {
      if (newSongList.length === 0) return;
      dispatch(LOAD_MORE_SONGS({ newSongList, updateSpotlight }));
    });
}

export const updateSpotlightSong = newSpotlightSong =>
  createAction('app/UPDATE_SPOTLIGHT_SONG')({ newSpotlightSong });

export const playSong = song =>
  createAction('app/PLAY_SONG')({ song });

export const playActiveSong = createAction('app/PLAY_ACTIVE_SONG');

export const pauseSong = createAction('app/PAUSE_SONG');
