import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, pickBy, uniq, compact, flatten, indexOf, orderBy } from 'lodash';
import { IoIosClose } from 'react-icons/io';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import $ from 'jquery';

import { fetchGenres } from 'actions/fetch/genres';
import { resetSongs } from 'actions/fetch/songs';

import { ALL_GENRES } from 'constants/base-genres';

import './stylesheets/genre-filters.scss';

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,

  // Redux
  genres: PropTypes.object.isRequired,
  genreFilters: PropTypes.array.isRequired,
  subgenreFilters: PropTypes.array.isRequired,
  fetchGenres: PropTypes.func.isRequired,
  resetSongs: PropTypes.func.isRequired
}

class GenreFilters extends Component {

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();

    this.state = {
      selectedGenres: {},   // Keyed by genre name
      selectedSubgenres: {} // Keyed by genre id
    }
    props.fetchGenres();
  }

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.hideOnClickOff);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.hideOnClickOff);
  }

  disableScrolling = () => $('body').css('overflow', 'hidden');

  enableScrolling = () => $('body').css('overflow', 'auto');

  closeModal = () => {
    this.props.hide();
    this.setState({
      selectedGenres: this.props.genreFilters.reduce((currGenres, genre) => ({
        ...currGenres,
        [genre.name]: genre
      }), {}),
      selectedSubgenres: this.props.subgenreFilters.reduce((currSubgenres, subgenre) => ({
        ...currSubgenres,
        [subgenre.id]: subgenre
      }), {})
    });

    this.enableScrolling();
  }

  hideOnClickOff = event =>
    this.modalRef.current &&
    !this.modalRef.current.contains(event.target) &&
    this.closeModal()

  getGenreName = genre => genre.spacedName || genre.name;

  // Mark selected genre as set or unset
  // Always reset the child subgenres
  toggleGenre = genreName => {
    const genre = this.props.genres[genreName];
    this.setState({
      ...this.state,
      selectedGenres: {
        ...this.state.selectedGenres,
        [genreName]: !!this.state.selectedGenres[genreName] ? undefined : genre
      },
      selectedSubgenres:
        genre.subgenres.reduce(
          (currSubgenres, subgenreToRemove) => ({
            ...currSubgenres,
            [subgenreToRemove.id]: undefined
          }),
          this.state.selectedSubgenres
        )
    })
  }

  // Mark selected subgenre as set or unset
  // Always reset the parent genre
  toggleSubgenre = (genreName, subgenre) =>
    this.setState({
      ...this.state,
      selectedGenres: {
        ...this.state.selectedGenres,
        [genreName]: undefined
      },
      selectedSubgenres: {
        ...this.state.selectedSubgenres,
        [subgenre.id]: !!this.state.selectedSubgenres[subgenre.id] ?
          undefined : { ...subgenre, parentGenre: genreName }
      }
    })

  areAnyGenresSelected = () => find(this.state.selectedGenres, x => !!x)

  areAllGenresSelected = () =>
    !this.areAnyGenresSelected() &&
    !this.areAnySubgenresSelected()

  areAnySubgenresSelected = () =>
    !!find(this.state.selectedSubgenres, x => !!x)

  areNoneSelected = () => !this.areAnyGenresSelected() && !this.areAnySubgenresSelected()

  selectAllGenres = () =>
    this.setState({
      ...this.state,
      selectedGenres: {},
      selectedSubgenres: {}
    })

  shouldHideSubgenreGroupMobile = genreName =>
    !this.state.selectedGenres[genreName] &&
    !find(Object.values(this.state.selectedSubgenres), ['parentGenre', genreName])

  submit = () => {
    const genreFilters = Object.values(this.state.selectedGenres).filter(g => !!g)
    const subgenreFilters = Object.values(this.state.selectedSubgenres).filter(sg => !!sg)

    const isSelectionDifferent = (
      genreFilters !== this.props.genreFilters &&
      subgenreFilters !== this.props.subgenreFilters
    );

    if (isSelectionDifferent)
      this.props.resetSongs({ genreFilters, subgenreFilters });

      disableBodyScroll(document.querySelector('#genreModalScroll'));

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

          <div id="genreModalScroll" className="genre-filter-content-container">
            {
              Object.keys(this.props.genres).length > 0 ? (
                <div className="genre-filter-content" ref={this.modalRef}>

                  <div className="close" onClick={() => this.closeModal()}><IoIosClose /></div>

                  <div
                    className={
                      'genres' +
                      (this.areAllGenresSelected() ? ' all-selected' : '')
                    }
                  >
                    <div className="genre-header">
                      <span><span className="less-bold">pick your</span> genres <span className="separator">|</span></span>
                      <div
                        className="gf-button all-button"
                        onClick={() => this.selectAllGenres()}
                      >
                        reset
                      </div>
                    </div>

                    { ALL_GENRES.map(genreName => (
                        <div
                          className={
                            `gf-button genre-button ${genreName}` +
                            (!!this.state.selectedGenres[genreName] ? ' selected' : '') +
                            (this.areAllGenresSelected() ? ' included' : '')
                          }
                          onClick={() => this.toggleGenre(genreName)}
                        >
                        <span>
                          { this.getGenreName(this.props.genres[genreName]) }
                        </span>
                        </div>
                    ))}
                  </div>

                  <div
                    className={
                      'subgenres' +
                      (this.areAnySubgenresSelected() ? ' any-selected' : '')
                    }
                  >
                    <div
                      className={
                        'subgenre-header' +
                        (this.areNoneSelected() ? ' hide-mobile' : '')
                      }
                    >
                      <span className="less-bold">or your</span> subgenres
                    </div>

                    { ALL_GENRES.map(genreName => (
                        <div
                          className={
                            `subgenre-group ${genreName}` +
                            (this.shouldHideSubgenreGroupMobile(genreName) ? ' hide-mobile' : '')
                          }
                        >
                          {
                            orderBy(this.props.genres[genreName].subgenres,['name'], ['asc']).map(subgenre => (
                              !subgenre.isHidden &&
                              <div
                                className={
                                  'gf-button subgenre-button' +
                                  (!!this.state.selectedSubgenres[subgenre.id] ? ' selected' : '') +
                                  (!!this.state.selectedGenres[genreName] ? ' included' : '')
                                }
                                onClick={() => this.toggleSubgenre(genreName, subgenre)}
                              >
                              <span>
                                { this.getGenreName(subgenre) }
                              </span>

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
  ({ genres, genreFilters, subgenreFilters }) => ({
    genres,
    genreFilters,
    subgenreFilters
  }),
  { fetchGenres, resetSongs }
)(GenreFilters);
