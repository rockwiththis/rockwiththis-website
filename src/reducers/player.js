import { get } from 'lodash';
import { expectPayloadValue } from 'reducers/util';

const isSongLoaded = (song, state) => !!state.songPlayerDurations[song.id]

export default {
  'app/PLAY_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'song', 'PLAY_SONG');

    const duration = get(action.payload, 'duration', state.songPlayerDurations[action.payload.song.id]);

    return {
      ...state,
      activeSong: action.payload.song,
      isPlaying: true,
      activeSongDuration: duration,
      activeSongProgress: {
        playedRatio: 0,
        secondsPlayed: 0,
      },
      nextSong: undefined,
      songPlayerDurations: {
        ...state.songPlayerDurations,
        [action.payload.song.id]: duration
      },
      didAutoplayFail: false
    };
  },
  'app/LOAD_AND_PLAY_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'song', 'PLAY_SONG');

    return {
      ...state,
      nextSong: action.payload.song
    }
  },
  'app/PLAY_ACTIVE_SONG': (state, action) => ({
    ...state,
    isPlaying: true,
    didAutoplayFail: false
  }),
  'app/PAUSE_SONG': (state, action) => ({
    ...state,
    isPlaying: false
  })
}
