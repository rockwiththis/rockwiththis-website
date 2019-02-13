import { expectPayloadValue } from 'reducers/util';

export default {

  'app/LOADING_GENRES': state => ({
      ...state,
      loadingGenres: true,
      genreLoadingError: undefined
  }),

  'app/LOAD_GENRES_FAILED': (state, action) => {
    expectPayloadValue(action.payload, 'errorMessage', 'LOAD_GENRES_FAILED');

    return {
      ...state,
      loadingGenres: false,
      genreLoadingError: action.payload.errorMessage
    };
  },

  'app/GENRES_LOADED': (state, action) => {
    expectPayloadValue(action.payload, 'genres', 'GENRES_LOADED');

    return {
      ...state,
      genres: action.payload.genres,
      loadingGenres: false,
      genreLoadingError: undefined
    };
  }
}
