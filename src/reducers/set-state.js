import { expectPayloadValue } from 'reducers/util';

import { ALL_VIEWS } from 'constants/discover-views';

export default {

  'app/UPDATE_SPOTLIGHT_SONG': (state, action) => {
    expectPayloadValue(action.payload, 'newSpotlightSong', 'UPDATE_SPOTLIGHT_SONG');

    return {
      ...state,
      spotlightPost: action.payload.newSpotlightSong
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
      didAutoplayFail: action.payload.didAutoplayFail
    }
  }
}
