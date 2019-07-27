import { createAction } from 'redux-actions'

export const updateSpotlightSong = newSpotlightSong =>
  createAction('app/UPDATE_SPOTLIGHT_SONG')({ newSpotlightSong });

export const updateDiscoverLayout = newDiscoverLayout =>
  createAction('app/UPDATE_DISCOVER_LAYOUT')({ newDiscoverLayout });

export const setLoadedPlayerDuration = ({ songId, durationSeconds }) =>
  createAction('app/SET_LOADED_PLAYER_DURATION')({ songId, durationSeconds })

export const setActiveSongProgress = ({ playedRatio, playedSeconds }) =>
  createAction('app/SET_ACTIVE_SONG_PROGRESS')({ playedRatio, playedSeconds })

const SET_ERROR = createAction('app/SET_ERROR');
export const setError = error => SET_ERROR({ error })
export const resolveError = () => SET_ERROR({ error: null })
