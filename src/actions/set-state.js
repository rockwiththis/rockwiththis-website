import { createAction } from 'redux-actions'

export const updateSpotlightSong = newSpotlightSong =>
  createAction('app/UPDATE_SPOTLIGHT_SONG')({ newSpotlightSong });

export const updateDiscoverLayout = newDiscoverLayout =>
  createAction('app/UPDATE_DISCOVER_LAYOUT')({ newDiscoverLayout });

export const didAutoplayFail = didAutoplayFail =>
  createAction('app/DID_AUTOPLAY_FAIL')({ didAutoplayFail })

export const setLoadedPlayerDuration = ({ songId, durationSeconds }) =>
  createAction('app/SET_LOADED_PLAYER_DURATION')({ songId, durationSeconds })

export const setActiveSongProgress = ({ playedRatio, secondsPlayed }) =>
  createAction('app/SET_ACTIVE_SONG_PROGRESS')({ playedRatio, secondsPlayed })
