import { createAction } from 'redux-actions'

const PLAY_SONG = createAction('app/PLAY_SONG');
const LOAD_AND_PLAY_SONG = createAction('app/LOAD_AND_PLAY_SONG');
export const playSong = (song, duration) => (dispatch, getState) =>
  (!!duration || !!getState().songPlayerDurations[song.id]) ?
    dispatch(PLAY_SONG({ song, duration })) :
    dispatch(LOAD_AND_PLAY_SONG({ song }))

export const playActiveSong = createAction('app/PLAY_ACTIVE_SONG');

export const pauseSong = createAction('app/PAUSE_SONG');
