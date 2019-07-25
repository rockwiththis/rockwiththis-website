import { createAction } from 'redux-actions'
import { loadMoreSongs } from './fetch/songs';

const PLAY_NEW_SONG = createAction('app/PLAY_NEW_SONG');
const PLAY_ACTIVE_SONG = createAction('app/PLAY_ACTIVE_SONG');
const LOAD_AND_PLAY_SONG = createAction('app/LOAD_AND_PLAY_SONG');

export const playSong = (song, duration) => (dispatch, getState) => {
  const { activeSong, songPlayerDurations } = getState();

  if (activeSong.id === song.id)
    dispatch(PLAY_ACTIVE_SONG())

  else if (!!duration || !!songPlayerDurations[song.id])
    dispatch(PLAY_NEW_SONG({ song, duration }))

  else
    dispatch(LOAD_AND_PLAY_SONG({ song }))
}

export const playActiveSong = createAction('app/PLAY_ACTIVE_SONG');

const LOAD_NEW_SONG = createAction('app/LOAD_NEW_SONG');
export const loadSong = song => LOAD_NEW_SONG({ song })

export const loadNextSong = () => (dispatch, getState) => {
  const { filteredPosts, activeSong } = getState();
  const nextIndex = filteredPosts.findIndex(song => song.id === activeSong.id) + 1;

  if (nextIndex >= filteredPosts.length) {
    loadMoreSongs()(dispatch, getState)
      .then(newSongs => dispatch(LOAD_NEW_SONG({ song: newSongs[0] })));

  } else {
    dispatch(LOAD_NEW_SONG({ song: filteredPosts[nextIndex] }));
  }
}

export const pauseSong = createAction('app/PAUSE_SONG');

export const playerBankUpdated = createAction('app/PLAYER_BANK_UPDATED');
