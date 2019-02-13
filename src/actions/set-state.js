import { createAction } from 'redux-actions'

export const updateSpotlightSong = newSpotlightSong =>
  createAction('app/UPDATE_SPOTLIGHT_SONG')({ newSpotlightSong });

export const updateDiscoverLayout = newDiscoverLayout =>
  createAction('app/UPDATE_DISCOVER_LAYOUT')({ newDiscoverLayout });
