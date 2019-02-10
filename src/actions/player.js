import { createAction } from 'redux-actions'

export const playSong = song =>
  createAction('app/PLAY_SONG')({ song });

export const playActiveSong = createAction('app/PLAY_ACTIVE_SONG');

export const pauseSong = createAction('app/PAUSE_SONG');
