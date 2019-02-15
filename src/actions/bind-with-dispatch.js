import { createAction } from 'redux-actions'
import * as Scroll from 'react-scroll'
import $ from "jquery";

// This file is deprecated. We should start migrating actions to index.js instead of adding any code here.

const apiBaseUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:9292/api' : '/api'
// const apiBaseUrl = 'http://ec2-18-208-165-207.compute-1.amazonaws.com/api/'
// const apiBaseUrl = 'http://www.rockwiththis.com/api/'

export const SET_LOADING_STATUS = createAction('app/SET_LOADING_STATUS')
export const SET_FILTERED_SONG_LIST = createAction('app/SET_FILTERED_SONG_LIST')

export const setFilteredSongList = (callback) => (dispatch, getState) => {
  dispatch(SET_LOADING_STATUS(true))

  const filtersArray = []
  const filterIds = getState().selectedFilters.map(filter => filter.id)
  filtersArray.push(filterIds)
  console.log("filtersArray:", filtersArray);

  const fullURL = apiBaseUrl + `/songs?tags=[${filtersArray}]&limit=16`

  fetch(fullURL).then(res => res.json()).then((res) => {

    dispatch(SET_LOADING_STATUS(false))
    console.log("resx");
    console.log(res);
    if (res.length > 0) {
      dispatch(SET_FILTERED_SONG_LIST(res))

      if (callback) callback()
    } else {
      if (callback) callback(true)
    }
  })
}

export const LOAD_MORE_SONGS = createAction('app/LOAD_MORE_SONGS');
export const LOAD_NEXT_SONGS = createAction('app/LOAD_NEXT_SONGS');

export const loadMoreSongs = (callback, updateSpotlight = false) => (dispatch, getState) => {
  const state = getState();

  if (state.currentPostPageIndex < state.maxSongListPageIndex) {
    dispatch(LOAD_NEXT_SONGS({ updateSpotlight }));

  } else {
    // TODO try just setting this at once
    const filtersArray = []
    const filterIds = getState().selectedFilters.map(filter => filter.id)
    filtersArray.push(filterIds)

    const fullURL = apiBaseUrl + `/songs?offset=${state.filteredPosts.length}&tags=[${filtersArray}]`
    fetch(fullURL)
    .then(res => res.json())
    .then(newSongList => {

      if (newSongList.length > 0) {

        if (window.innerWidth > 800) {
            $('#discovery-container').animate({scrollTop: 0}, 100);
        } else {
          Scroll.scroller.scrollTo('discovery-container', {
            duration: 500,
            smooth: true
          })
        }
        dispatch(LOAD_MORE_SONGS({ newSongList, updateSpotlight }));

        if (callback) callback(newSongList);
      } else {
        return;
      }
    })
  }
}

const LOAD_PREVIOUS_SONGS = createAction('app/LOAD_PREVIOUS_SONGS');
export const loadPreviousSongs = (updateSpotlight = false) => dispatch => {
  if (window.innerWidth > 800) {
      $('#discovery-container').animate({scrollTop: 0}, 100);
  } else {
    Scroll.scroller.scrollTo('discovery-container', {
      duration: 500,
      smooth: true
    })
  }
  dispatch(LOAD_PREVIOUS_SONGS({ updateSpotlight }))
};

const UPDATE_SPOTLIGHT_SONG = createAction('app/UPDATE_SPOTLIGHT_SONG');
export const updateSpotlightSong = newSpotlightSong => dispatch => {
  dispatch(UPDATE_SPOTLIGHT_SONG(newSpotlightSong));
}

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

export const TOGGLE_FILTER = createAction('app/TOGGLE_FILTER')
export const toggleFilter = (filter, i) => (dispatch) => {
    const payload = { filter, i }
    dispatch(TOGGLE_FILTER(payload))
}

export const CLEAR_FILTERS = createAction('app/CLEAR_FILTERS')
export const clearFilters = () => (dispatch) => {
    dispatch(CLEAR_FILTERS())
}

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

export const FETCH_RELATED_SONGS = {
    IN_PROGRESS: 'FETCH_RELATED_SONGS_IN_PROGRESS',
    SUCCESS: 'FETCH_RELATED_SONGS_SUCCESS',
    FAILURE: 'FETCH_RELATED_SONGS_FAILURE',
}



export const playNextSong = () => (dispatch, getState) => {
  const nextSong = getState().queue.queue[0]
  dispatch(toggleSong(nextSong))
}
