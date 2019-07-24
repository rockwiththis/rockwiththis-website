import { expectPayloadValue } from 'reducers/util';

import { ALL_VIEWS } from 'constants/discover-views';

export default {

  'app/UPDATE_SPOTLIGHT_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'newSpotlightSong', 'UPDATE_SPOTLIGHT_SONG');

    return {
      ...state,
      spotlightPost: action.payload.newSpotlightSong,
      shouldPrioritizePlayers: true
    };
  },

  'app/UPDATE_DISCOVER_LAYOUT': (state, action) => {
    expectPayloadValue(action.payload, 'newDiscoverLayout', 'UPDATE_DISCOVER_LAYOUT', ALL_VIEWS);

    return {
      ...state,
      discoverLayout: action.payload.newDiscoverLayout
    }
  },

  'app/DID_AUTOPLAY_FAIL': (state, action) => {
    expectPayloadValue(action.payload, 'didAutoplayFail', 'DID_AUTOPLAY_FAIL');

    return {
      ...state,
      didAutoplayFail: action.payload.didAutoplayFail,
      isPlaying: false
    }
  },

  'app/SET_LOADED_PLAYER_DURATION': (state, action) => {
    expectPayloadValue(action.payload, 'songId', 'SET_LOADED_PLAYER_DURATION');
    expectPayloadValue(action.payload, 'durationSeconds', 'SET_LOADED_PLAYER_DURATION');

    return {
      ...state,
      songPlayerDurations: {
        ...state.songPlayerDurations,
        [action.payload.songId]: action.payload.durationSeconds
      }
    }
  },

  'app/SET_ACTIVE_SONG_PROGRESS': (state, action) => {
    expectPayloadValue(action.payload, 'playedRatio', 'SET_ACTIVE_SONG_PROGRESS');
    expectPayloadValue(action.payload, 'secondsPlayed', 'SET_ACTIVE_SONG_PROGRESS');

    return {
      ...state,
      activeSongProgress: {
        playedRatio: action.payload.playedRatio,
        secondsPlayed: action.payload.secondsPlayed
      }
    };
  }
}
