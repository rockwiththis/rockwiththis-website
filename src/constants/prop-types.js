import PropTypes from 'prop-types';

export const songDataPropTypes = PropTypes.exact({
  newest: PropTypes.array.isRequired,
  filtered: PropTypes.array.isRequired,
  spotlight: PropTypes.object.isRequired,
  loadMore: PropTypes.func.isRequired,
  resetSongs: PropTypes.func.isRequired,
  setSpotlight: PropTypes.func.isRequired,
  areShuffled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
})

export const genresPropTypes = PropTypes.exact({
  available: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired
})

export const songPlayerPropTypes = PropTypes.exact({
  status: PropTypes.string.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired
})

// TODO define expected shape of song / genre data from db
