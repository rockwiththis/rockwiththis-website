import PropTypes from 'prop-types';

export const songDataShape = {
  newest: PropTypes.array.isRequired,
  filtered: PropTypes.array.isRequired,
  spotlight: PropTypes.object.isRequired,
  loadMore: PropTypes.func.isRequired,
  resetSongs: PropTypes.func.isRequired,
  setSpotlight: PropTypes.func.isRequired,
  areShuffled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export const genresShape = {
  available: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  fetch: PropTypes.func.isRequired
}

export const songPlayerShape = {
  status: PropTypes.string.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired
}

// TODO define expected shape of song / genre data from db
