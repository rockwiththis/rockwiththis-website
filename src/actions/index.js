import { createAction } from 'redux-actions'
import { FETCH_FILTERS } from './filters'

const apiBaseUrl = process.env.NODE_ENV == 'development' ? 'http://localhost:9292/api' : '/api'

export const fetchFilters = (pageNumber = 1) => (dispatch, getState) => {
  dispatch({
    type: FETCH_FILTERS.IN_PROGRESS,
  })
  const dataURL = apiBaseUrl + '/subgenres'
  fetch(dataURL).then(res => res.json()).then(res => {
    dispatch({
      type: FETCH_FILTERS.SUCCESS,
      filters: res,
    })
  }).catch((error) => {
    dispatch({
      type: FETCH_FILTERS.FAILURE,
      payload: error,
    })
  })
}

export const FETCH_POSTS = createAction('app/FETCH_POSTS')
export const SET_REMAINING_POSTS = createAction('app/SET_REMAINING_POSTS')
export const fetchPosts = (pageNumber = 1, callback) => (dispatch) => {
  dispatch(CLEAR_FILTERS())

  const dataURL = apiBaseUrl + '/songs'
  console.log('QUERYING FOR DATA FROM ' + dataURL);

  fetch(dataURL).then(res => res.json()).then((res) => {

    console.log("res1", res)
    dispatch(FETCH_POSTS(res))
  })
}

export const CURRENT_REQUEST_LOADING = createAction('app/CURRENT_REQUEST_LOADING')
export const FETCH_CURRENT_REQUEST = createAction('app/FETCH_CURRENT_REQUEST')

export const fetchCurrentRequest = (callback) => (dispatch, getState) => {
  dispatch(CURRENT_REQUEST_LOADING(true))
  const baseURL = apiBaseUrl + '/songs'
  const filtersArray = []
  const filterIds = getState().selectedFilters.map(filter => filter.id)
  filtersArray.push(filterIds)

  console.log("filtersArray:", filtersArray);

  const fullURL = apiBaseUrl + `/songs?tags=[${filtersArray}]&limit=16`

  fetch(fullURL).then(res => res.json()).then((res) => {


    dispatch(CURRENT_REQUEST_LOADING(false))
    console.log("resx");
    console.log(res);
    if (res.length > 0) {
      dispatch(FETCH_CURRENT_REQUEST(res))

      if (callback) callback()
    } else {
      if (callback) callback(true)
    }
  })
}

export const LOAD_MORE_SONGS = createAction('app/LOAD_MORE_SONGS')
export const loadMoreSongs = (callback) => (dispatch, getState) => {
  const state = getState();
  const filtersArray = []
  const filterIds = getState().selectedFilters.map(filter => filter.id)
  filtersArray.push(filterIds)

  const fullURL = apiBaseUrl + apiBaseUrl + `/songs?offset=${state.filteredPosts.length}&tags=[${filtersArray}]`
  console.log("sss");
  console.log(fullURL);

  // const filterIds = getState().selectedFilters.map(filter => filter.term_id)
  // const filterParamsString = filterIds.length > 0 ? '&tags[]=' + filterIds.join('&tags[]=') : ''
  // const fullURL = baseURL + filterParamsString

  fetch(fullURL).then(res => res.json()).then((res) => {
    if (res.length > 0) {
      dispatch(LOAD_MORE_SONGS(res))
      if (callback) callback()
    } else {
      if (callback) callback(true)
    }
  })
}

export const TOGGLE_PLAY_PAUSE = createAction('app/TOGGLE_PLAY_PAUSE')
export const togglePlayPause = playPause => (dispatch) => {
  console.log("toggling")
  dispatch(TOGGLE_PLAY_PAUSE(playPause))
}

export const TOGGLE_SONG = createAction('app/TOGGLE_SONG')
export const toggleSong = song => (dispatch) => {
  console.log("the song is")
  console.log(song)
  dispatch(TOGGLE_SONG(song))
}

export const CHANGE_GRID_VIEW = createAction('app/CHANGE_GRID_VIEW')
export const changeGridView = layout => (dispatch) => {
  dispatch(CHANGE_GRID_VIEW(layout))
}

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
  const songURL = apiBaseUrl + apiBaseUrl + `/songs/${songId}`

  fetch(songURL).then(res => res.json()).then((res) => {
    dispatch(FETCH_SINGLE_SONG(res))
    if (callback) {
      callback()
    }

    const tags = res.sub_genres.map((subgenre) => subgenre.id)
    const tagURL = apiBaseUrl + apiBaseUrl + `/songs?tags=[${tags}]`

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
