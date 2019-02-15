import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchGenres } from 'actions/fetch/genres';
import { ALL_GENRES } from 'constants/base-genres';

import './stylesheets/genre-filters.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,

  // Redux
  genres: PropTypes.object.isRequired,
  fetchGenres: PropTypes.func.isRequired
}

class GenreFilters extends Component {

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();

    this.state = {
      selectedGenres: [],
      selectedSubgenres: []
    }

    props.fetchGenres();
  }

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.hideOnClickOff);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.hideOnClickOff);
  }

  hideOnClickOff = event =>
    this.modalRef.current &&
    !this.modalRef.current.contains(event.target) &&
    this.props.hide();

  getGenreName = genre => genre.spacedName || genre.name;

  render() {
    return (
        <div
          className={
            'genre-filters' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
          <div className="modal-overlay"></div>
          <div className="modal-background-container">
            <div className="modal-background" ref={this.modalRef}></div>
          </div>

          <div className="genre-filter-content-container">
            {
              Object.keys(this.props.genres).length > 0 &&
              <div className="genre-filter-content">
                <div className="genre-header">pick your genres</div>

                <div className="genres">
                  { ALL_GENRES.map(genreKey => (
                      <div className={`genre-button ${genreKey}`}>
                        { this.getGenreName(this.props.genres[genreKey]) }
                      </div>
                  ))}
                </div>

                <div className="subgenre-header">subgenres</div>

                <div className="subgenres">
                  { ALL_GENRES.map(genreKey => {
                      const genre = this.props.genres[genreKey];

                      return (
                          <div className={`subgenre-group ${genreKey}`}>
                            {
                              !genre.isHidden &&
                              <div className='subgenre-button'>{ this.getGenreName(genre) }</div>
                            }
                            {
                              genre.subgenres.map(subgenre => (
                                !subgenre.isHidden &&
                                <div className='subgenre-button'>{ this.getGenreName(subgenre) }</div>
                              ))
                            }
                          </div>
                      );
                  })}
                </div>

                <div className="submit-button">submit</div>
              </div>
            }
          </div>

        </div>
    )
  }
}

GenreFilters.propTypes = propTypes;

export default connect(
  ({ genres }) => ({ genres }),
  { fetchGenres }
)(GenreFilters);
