import { createAction } from 'redux-actions'

const API_BASE_URL =
  process.env.NODE_ENV == 'development' ?
    'http://localhost:9292/api' :
    '/api';

const LOADING_GENRES = createAction('app/LOADING_GENRES');
const LOAD_GENRES_FAILED = createAction('app/LOAD_GENRES_FAILED');
const GENRES_LOADED = createAction('app/GENRES_LOADED');
  
export const fetchGenres = () => dispatch => {
  dispatch(LOADING_GENRES());
  return fetch(`${API_BASE_URL}/subgenres/grouped`)
    .then(res => res.json())
    .then(fetchedGenres => {
      console.log("FETCHED GENRES!!!",fetchedGenres);
      Object.keys(fetchedGenres).length === 0 ?
        dispatch(LOAD_GENRES_FAILED({ errorMessage: 'Could not find any genres' })) :
        dispatch(GENRES_LOADED({ genres: fetchedGenres }))
    })
    .catch(e => dispatch(LOAD_GENRES_FAILED({ errorMessage: e.message })));
}
