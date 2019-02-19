import { createAction } from 'redux-actions'

export const setMainScroll = scrollPos =>
  createAction('app/SET_MAIN_SCROLL')({ scrollPos });

export const setDiscoverScroll = scrollPos =>
  createAction('app/SET_DISCOVER_SCROLL')({ scrollPos });
