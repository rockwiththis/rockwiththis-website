import { createAction } from 'redux-actions'
import { resetSongs } from './fetch/songs';

export const updateSpotlightSong = newSpotlightSong =>
  createAction('app/UPDATE_SPOTLIGHT_SONG')({ newSpotlightSong });
