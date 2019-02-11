import { expectPayloadValue } from 'reducers/util';

export default {

  'app/LOADING_SONGS': state => ({
    ...state,
    loadingSongs: true,
    songLoadingError: undefined
  }),

  'app/LOAD_SONGS_FAILED': (state, action) => {
    expectPayloadValue(action.payload, 'errorMessage', 'LOAD_SONGS_FAILED');

    return {
      ...state,
      loadingSongs: false,
      songLoadingError: action.payload.errorMessage
    };
  },

  'app/LOAD_INITIAL_SONGS': (state, action) => {
    expectPayloadValue(action.payload, 'songs', 'RESET_SONGS');
  },

  'app/RESET_SONGS': (state, action) => {
    expectPayloadValue(action.payload, 'songs', 'RESET_SONGS');
    const isShuffle = action.payload.isShuffle === undefined ?
      state.isShuffle : action.payload.isShuffle

    return {
      ...state,
      filteredPosts: action.payload.songs,
      heroPosts: (
          state.heroPosts.length > 0 ?
            state.heroPosts : action.payload.songs.slice(0,7)
      ),
      spotlightPost: (
          Object.keys(state.spotlightPost).length > 0 ?
            state.spotlightPost : action.payload.songs[0]
      ),
      activeSong: (
          Object.keys(state.activeSong).length > 0 ?
            state.activeSong : action.payload.songs[0]
      ),
      isShuffle: isShuffle,
      shouldLoadPlayers: true,
      loadingSongs: false,
      songLoadingError: undefined,
      discoverScrollPos: 0
    }
  },

  'app/LOADED_MORE_SONGS': (state, action) => {
    expectPayloadValue(action.payload, 'newSongs', 'LOADED_MORE_SONGS');

    return {
      ...state,
      filteredPosts: [ ...state.filteredPosts, ...action.payload.newSongs ],
      spotlightPost: (
        action.payload.updateSpotlight ?
          action.payload.newSongs[0] :
          state.spotlightPost
      ),
      shouldLoadPlayers: true,
      loadingSongs: false,
      songLoadingError: undefined
    };
  }
}
