import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './stylesheets/genre-filters.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired
}

class GenreFilters extends Component {

  constructor(props) {
    super(props);
    this.mainDivRef = React.createRef();
  }

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.hideOnClickOff);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.hideOnClickOff);
  }

  hideOnClickOff = event => {
    console.log("CLICK OFF FILTERS", this.mainDivRef.current)
    this.mainDivRef.current &&
    !this.mainDivRef.current.contains(event.target) &&
    this.props.hide();
  }

  render() {
    return (
        <div
          className={
            'genre-filters' +
            (this.props.isActive ? '' : ' hidden')
          }
          ref={this.mainDivRef}
        >
          <p>Filter genres here!</p>
        </div>
    )
  }
}

GenreFilters.propTypes = propTypes;

export default GenreFilters;
