import { expectPayloadValue } from 'reducers/util';

export default {

  'app/SET_MAIN_SCROLL': (state, action) => {
    expectPayloadValue(action.payload, 'scrollPos', 'SET_MAIN_SCROLL');
    return { ...state, mainScrollPos: action.payload.scrollPos };
  },

  'app/SET_DISCOVER_SCROLL': (state, action) => {
    expectPayloadValue(action.payload, 'scrollPos', 'SET_DISCOVER_SCROLL');
    return { ...state, discoverScrollPos: action.payload.scrollPos };
  },
}
