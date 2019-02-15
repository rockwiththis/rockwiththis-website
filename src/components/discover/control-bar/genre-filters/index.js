import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, uniq, compact } from 'lodash';

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

  // Mark selected genre as set or unset
  // Always reset the child subgenres
  toggleGenre = genreName => {
    const genreId = this.props.genres[genreName].id;
    this.setState({
      ...this.state,
      selectedGenres: {
        ...this.state.selectedGenres,
        [genreId]: !!this.state.selectedGenres[genreId] ? undefined : true
      },
      selectedSubgenres:
        this.props.genres[genreName].subgenres.reduce(
          (currSubgenres, subgenreToRemove) => ({
            ...currSubgenres,
            [subgenreToRemove.name]: undefined
          }),
          this.state.selectedSubgenres
        )
    })
  }

  // Mark selected subgenre as set or unset
  // Always reset the parent genre
  toggleSubgenre = (genreId, subgenreId) =>
    this.setState({
      ...this.state,
      selectedGenres: {
        ...this.state.selectedGenres,
        [genreId]: undefined
      },
      selectedSubgenres: {
        ...this.state.selectedSubgenres,
        [subgenreId]: !!this.state.selectedSubgenres[subgenreId] ? undefined : genreId
      }
    })

  areAllGenresSelected = () =>
    !find(this.state.selectedGenres, x => !!x)

  areAnySubgenresSelected = () =>
    !!find(this.state.selectedSubgenres, x => !!x)

  selectAllGenres = () =>
    this.setState({
      ...this.state,
      selectedGenres: {},
      selectedSubgenres: {}
    })

  clearSelectedSubgenres = () => {
    const includedGenreKeys = uniq(compact(
      Object.values(this.state.selectedSubgenres)
    ));
    this.setState({
      ...this.state,
      selectedGenres:
        includedGenreKeys.reduce((currGenres, genreKey) => ({
          ...currGenres,
          [genreKey]: true
        }), this.state.selectedGenres),
      selectedSubgenres: {}
    })
  }

  submit = () => {

  }

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
            <div className="modal-background"></div>
          </div>

          <div className="genre-filter-content-container">
            {
              Object.keys(this.props.genres).length > 0 ? (
                <div className="genre-filter-content" ref={this.modalRef}>

                  <div
                    className={
                      'genres' +
                      (this.areAllGenresSelected() ? ' all-selected' : '')
                    }
                  >
                    <div className="genre-header">
                      <span>pick your genres | </span>
                      <div
                        className="gf-button all-button"
                        onClick={() => this.selectAllGenres()}
                      >
                        all
                      </div>
                    </div>

                    { ALL_GENRES.map(genreName => {
                        const genreId = this.props.genres[genreName].id;
                        return (
                            <div
                              className={
                                `gf-button genre-button ${genreName}` +
                                (!!this.state.selectedGenres[genreId] ? ' selected' : '') +
                                (this.areAllGenresSelected() ? ' included' : '')
                              }
                              onClick={() => this.toggleGenre(genreName)}
                            >
                              { this.getGenreName(this.props.genres[genreName]) }
                            </div>
                        );
                    })}
                  </div>

                  <div
                    className={
                      'subgenres' +
                      (this.areAnySubgenresSelected() ? ' any-selected' : '')
                    }
                  >
                    <div className="subgenre-header">
                      <span>subgenres | </span>
                      <div
                        className="gf-button clear-button"
                        onClick={() => this.clearSelectedSubgenres()}
                      >
                        clear
                      </div>
                    </div>

                    { ALL_GENRES.map(genreName => {
                        const genreId = this.props.genres[genreName].id;
                        return (
                            <div className={`subgenre-group ${genreName}`}>
                              {
                                this.props.genres[genreName].subgenres.map(subgenre => (
                                  !subgenre.isHidden &&
                                  <div
                                    className={
                                      'gf-button subgenre-button' +
                                      (!!this.state.selectedSubgenres[subgenre.id] ? ' selected' : '') +
                                      (!!this.state.selectedGenres[genreId] ? ' included' : '')
                                    }
                                    onClick={() => this.toggleSubgenre(genreId, subgenre.id)}
                                  >
                                    { this.getGenreName(subgenre) }
                                  </div>
                                ))
                              }
                            </div>
                        );
                    })}
                  </div>

                  <div
                    className="gf-button submit-button"
                    onClick={() => this.submit()}
                  >submit</div>
                </div>
              ) : (
                <div className="genre-filter-content" ref={this.modalRef}></div>
              )
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
