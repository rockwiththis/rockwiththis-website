import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './stylesheets/genre-filters.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
}

class GenreFilters extends Component {

  render() {
    return (
        <div
          className={
            'genre-filters' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
          <p>Filter genres here!</p>
        </div>
    )
  }
}

GenreFilters.propTypes = propTypes;

export default GenreFilters;
