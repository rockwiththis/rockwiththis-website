import { expectPayloadValue } from 'reducers/util';
import { omitBy, get } from 'lodash';

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

  'app/SET_INITIAL_SONGS': (state, action) => {
    expectPayloadValue(action.payload, 'songs', 'SET_INITIAL_SONGS');

    return {
      ...state,
      filteredPosts: action.payload.songs,
      heroPosts: action.payload.songs.slice(0,7),
      spotlightPost: action.payload.songs[0],
      activeSong: action.payload.songs[0],
      shouldLoadPlayers: true,
      loadingSongs: false,
      songLoadingError: undefined,
    }
  },

  'app/RESET_SONGS': (state, action) => {
    expectPayloadValue(action.payload, 'songs', 'RESET_SONGS');

    const isShuffle = get(action.payload, 'isShuffle', state.isShuffle);
    const subgenreFilters = get(action.payload, 'subgenreFilters', state.subgenreFilters)

    const newPlayerDurations = state.filteredPosts
      .filter(oldSong => (
        !action.payload.songs.find(newSong => newSong.id === oldSong.id) &&
        !state.heroPosts.find(heroSong => heroSong.id === oldSong.id) &&
        state.spotlightPost.id != oldSong &&
        state.activeSong != oldSong.id
      ))
      .reduce(
        (newDurations, songId) => ({
          ...newDurations,
          [songId]: undefined
        }),
        state.songPlayerDurations,
      );

    return {
      ...state,
      filteredPosts: action.payload.songs,
      songPlayerDurations: newPlayerDurations,
      isShuffle: isShuffle,
      subgenreFilters: subgenreFilters,
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
