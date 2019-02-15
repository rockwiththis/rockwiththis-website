import { createAction } from 'redux-actions'
import * as Scroll from 'react-scroll'
import $ from "jquery";

// This file is deprecated. We should start migrating actions to index.js instead of adding any code here.

const apiBaseUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:9292/api' : '/api'

const PLAYER_BANK_UPDATED = createAction('app/PLAYER_BANK_UPDATED');
export const playerBankUpdated = () => dispatch => {
  dispatch(PLAYER_BANK_UPDATED());
}

const PLAYER_LOADED = createAction('app/PLAYER_LOADED');
export const playerLoaded = (loadedSongId, durationSeconds) => dispatch => (
  dispatch(PLAYER_LOADED({
    songId: loadedSongId,
    durationSeconds: durationSeconds
  }))
);

const PLAY_ACTIVE_SONG = createAction('app/PLAY_ACTIVE_SONG');
const PAUSE_SONG = createAction('app/PAUSE_SONG');
export const togglePlayPause = shouldPlay => (dispatch) => {
  console.log("toggling");
  dispatch(
      shouldPlay ? PLAY_ACTIVE_SONG() : PAUSE_SONG()
  );
}

export const toggleSong = song =>
  createAction('app/PLAY_SONG')({ song });

export const FETCH_SINGLE_SONG = createAction('app/FETCH_SINGLE_SONG')
export const SET_RELATED_SONGS = createAction('app/SET_RELATED_SONGS')

export const fetchSingleSong = (songId, callback) => (dispatch) => {
  const songURL = apiBaseUrl + `/songs/${songId}`

  fetch(songURL).then(res => res.json()).then((res) => {
    dispatch(FETCH_SINGLE_SONG(res))
    if (callback) {
      callback()
    }

    const tags = res.sub_genres.map((subgenre) => subgenre.id)
    const tagURL =  apiBaseUrl + `/songs?tags=[${tags}]`

    fetch(tagURL).then(related_res => related_res.json()).then((related_res) => {
      dispatch(SET_RELATED_SONGS(related_res))
    })
  })
}

export const CLEAR_SINGLE_SONG = createAction('app/CLEAR_SINGLE_SONG')
export const clearSingleSong = () => (dispatch) => {
  dispatch(CLEAR_SINGLE_SONG())
}

export const SET_SONG_PROGRESS = createAction('app/SET_SONG_PROGRESS')
export const setSongProgress = (played) => (dispatch) => {
  dispatch(SET_SONG_PROGRESS(played))
}

export const SET_SONG_DURATION = createAction('app/SET_SONG_DURATION')
export const setSongDuration = (duration) => (dispatch) => {
  dispatch(SET_SONG_DURATION(duration))
}

export const playNextSong = () => (dispatch, getState) => {
  const nextSong = getState().queue.queue[0]
  dispatch(toggleSong(nextSong))
}
