import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pickBy, get, find, flatten } from 'lodash';
import { IoIosClose } from 'react-icons/io';

import { fetchGenres } from 'actions/fetch/genres';
import { resetSongs } from 'actions/fetch/songs';

import { ALL_GENRES } from 'constants/base-genres';

import './stylesheets/genre-filters.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,

  // Redux
  genres: PropTypes.object.isRequired,
  fetchGenres: PropTypes.func.isRequired,
  subgenreFilters: PropTypes.array.isRequired,
  resetSongs: PropTypes.func.isRequired
}

class GenreFilters extends Component {

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();

    this.state = {
      selectedGroupedSubgenres: {},
      highlightedGenres: {}
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

  getSelectedSubgenresByGenre = genreName => {
    const x = pickBy(
      get(this.state.selectedGroupedSubgenres, genreName, {}),
      subgenre => !!subgenre
    )
    if (genreName === 'funk') console.log('BRING THA FUNK', x);
    return x;
  }

  areAnySubgenresSelectedForGenre = genreName =>
    Object.keys(this.getSelectedSubgenresByGenre(genreName)).length > 0

  isEntireGenreSelected = genreName =>
    this.props.genres[genreName].subgenres.length ===
    Object.keys(this.getSelectedSubgenresByGenre(genreName)).length

  shouldSetEntireGenre = genreName =>
    !this.isEntireGenreSelected(genreName) && (
      !!this.state.highlightedGenres[genreName] ||
      this.areAnySubgenresSelectedForGenre(genreName)
    )

  shouldSetGenreHighlighted = genreName =>
    !this.areAnySubgenresSelectedForGenre(genreName) &&
    !this.state.highlightedGenres[genreName]

  getAllSubgenresByGenre = genreName =>
    this.props.genres[genreName].subgenres.reduce(
      (curr, subgenre) => ({
        ...curr,
        [subgenre.id]: subgenre
      }),
      {}
    )

  // Cycle no subgenres -> highlighted -> all subgenres
  toggleGenre = genreName =>
    this.setState({
      ...this.state,
      selectedGroupedSubgenres: {
        ...this.state.selectedGroupedSubgenres,
        [genreName]: this.shouldSetEntireGenre(genreName) ?
          this.getAllSubgenresByGenre(genreName) : {}
      },
      highlightedGenres: {
        ...this.state.highlightedGenres,
        [genreName]: this.shouldSetGenreHighlighted(genreName) ?
          true : undefined
      }
    })

  // Mark selected subgenre as set or unset
  // Always un-highlight parent genre
  toggleSubgenre = (genreName, subgenre) => {
    const currGroupedSubgenres = this.getSelectedSubgenresByGenre(genreName);
    this.setState({
      ...this.state,
      selectedGroupedSubgenres: {
        ...this.state.selectedGroupedSubgenres,
        [genreName]: {
          ...currGroupedSubgenres,
          [subgenre.id]: currGroupedSubgenres[subgenre.id] ?
            undefined : subgenre
        }
      },
      highlightedGenres: {
        ...this.state.highlightedGenres,
        [genreName]: undefined
      }
    })
  }

  areAnySubgenresSelected = () => find(ALL_GENRES, this.areAnySubgenresSelectedForGenre);

  areAnyGenresHighlighted = () => find(Object.values(this.state.highlightedGenres), g => !!g);

  areAllGenresSelected = () =>
    !this.areAnySubgenresSelected() &&
    !this.areAnyGenresHighlighted()

  isGenreIncluded = genreName =>
    this.areAllGenresSelected() ||
    this.state.highlightedGenres[genreName] ||
    this.areAnySubgenresSelectedForGenre(genreName)

  areSubgenresIncluded = genreName =>
    this.state.highlightedGenres[genreName] &&
    !this.areAnySubgenresSelectedForGenre(genreName)

  selectAllGenres = () =>
    this.setState({
      ...this.state,
      selectedGroupedSubgenres: {},
      highlightedGenres: {}
    })

  // genre + no subgenres w/ parent genreName selected
  shouldHideSubgenreGroupMobile = genreName =>
    !this.state.highlightedGenres[genreName] &&
    !this.areAnySubgenresSelectedForGenre(genreName)

  getSubgenreIds = genres => flatten(genres.map(genre => (
    genre.isParent ?
      genre.subgenres.map(g => g.id) :
      genre.id
  )))

  submit = () => {
    const newGenreFilters = flatten(
      ALL_GENRES.map(genreName => (
        this.state.highlightedGenres[genreName] || this.isEntireGenreSelected(genreName) ?
          [{ ...this.props.genres[genreName], isParent: true }] :
          this.getSelectedSubgenresByGenre(genreName)
      ))
    );
    if (this.getSubgenreIds(newGenreFilters) !== this.getSubgenreIds(this.props.genreFilters))
      this.props.resetSongs({ genreFilters: newGenreFilters });

    this.props.hide();
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

                  <div className="close" onClick={() => this.props.hide()}><IoIosClose /></div>

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

                    { ALL_GENRES.map(genreName => (
                        <div
                          className={
                            `gf-button genre-button ${genreName}` +
                            (this.isEntireGenreSelected(genreName) ? ' selected' : '') +
                            (this.isGenreIncluded(genreName) ? ' included' : '')
                          }
                          onClick={() => this.toggleGenre(genreName)}
                        >
                          { this.getGenreName(this.props.genres[genreName]) }
                        </div>
                    ))}
                  </div>

                  <div className='subgenres'>
                    <div
                      className={
                        'subgenre-header' +
                        (this.areAllGenresSelected() ? ' hide-mobile' : '')
                      }
                    >
                      subgenres
                    </div>

                    { ALL_GENRES.map(genreName => (
                        <div
                          className={
                            `subgenre-group ${genreName}` +
                            (this.shouldHideSubgenreGroupMobile(genreName) ? ' hide-mobile' : '')
                          }
                        >
                          {
                            this.props.genres[genreName].subgenres.map(subgenre => (
                              !subgenre.isHidden &&
                              <div
                                className={
                                  'gf-button subgenre-button subgenre-badge' +
                                  (!!this.getSelectedSubgenresByGenre(genreName)[subgenre.id] ? ' selected' : '') +
                                  (this.areSubgenresIncluded(genreName) ? ' included' : '')
                                }
                                onClick={() => this.toggleSubgenre(genreName, subgenre)}
                              >
                                { this.getGenreName(subgenre) }
                              </div>
                            ))
                          }
                        </div>
                    ))}
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
  ({ genres, subgenreFilters }) => ({ genres, subgenreFilters }),
  { fetchGenres, resetSongs }
)(GenreFilters);
