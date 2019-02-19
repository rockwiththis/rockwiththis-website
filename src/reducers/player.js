import { expectPayloadValue } from 'reducers/util';

export default {
  'app/PAUSE_SONG': (state, action) => ({
    ...state,
    isPlaying: false
  }),
  'app/PLAY_ACTIVE_SONG': (state, action) => ({
    ...state,
    isPlaying: true
  }),
  'app/PLAY_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'song', 'PLAY_SONG');

    return {
      ...state,
      activeSong: action.payload.song,
      isPlaying: true,
      activeSongDuration: state.songPlayerDurations[action.payload.song.id],
      activeSongProgress: {
        playedRatio: 0,
        secondsPlayed: 0,
      }
    };
  },
}
