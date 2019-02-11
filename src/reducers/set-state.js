import { expectPayloadValue } from 'reducers/util';

export default {
  'app/UPDATE_SPOTLIGHT_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'newSpotlightSong', 'UPDATE_SPOTLIGHT_SONG');

    return {
      ...state,
      spotlightPost: action.payload.newSpotlightSong
    };
  },
}
