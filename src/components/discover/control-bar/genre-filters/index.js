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

const propTypes = {
  isActive: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  resetSongs: PropTypes.func.isRequired,
  // TODO use these instead
  genres: PropTypes.object.isRequired,

  // Redux
  genres: PropTypes.object.isRequired,
  genreFilters: PropTypes.array.isRequired,
  subgenreFilters: PropTypes.array.isRequired,
  fetchGenres: PropTypes.func.isRequired
}

class GenreFilters extends Component {

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();

    this.state = {
      selectedGenres: {},   // Keyed by genre name
      selectedSubgenres: {} // Keyed by genre id
    }
  }

  componentDidMount = () => this.props.fetchGenres();

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


    this.props.hide();
  }

  render = () => (
      <div
        className={
          'genre-filters' +
          (this.props.isActive ? '' : ' hidden')
        }
      >
        <div className="modal-overlay"></div>
        <div className="content-background-container">
          <div className="content-background"></div>
        </div>

        <div className="content-wrapper">
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

        <style jsx>{`
          .genre-filters.hidden {
            display: none;
          }
          .genre-filters {
            position: absolute;
            top: 55px;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10;
          }
          .modal-overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: white;
            opacity: 0.7;
          }
          .content-background-container {
            position: absolute;
            top: 10px;
            bottom: 10px;
            left: 0;
            right: 0;
          }
          .content-background {
            position: relative;
            width: 95%;
            height: 100%;
            margin: 0 auto;
            background-color: black;
            opacity: 0.9;
            border-radius: 8px;
          }
          .content-wrapper {
            position: relative;
            width: 95%;
            margin: 0 auto;
            margin-top: 10px;
            overflow: auto;
          }
          .genre-filter-content {
            color: white;
            font-weight: bold;
            text-align: center;
          }
          .close {
            position: absolute;
            top: 10px;
            right: 5px;
            font-size: 36pt;
            cursor: pointer;
            width: 50px;
            height: 50px;
            z-index: 11;
          }
          .gf-button {
            display: inline-block;
            margin: 10px 5px;
            background-color: #303030;
            box-shadow: 2px 2px 5px black;
            cursor: pointer;
          }
          .all-button {
            font-size: 12pt;
            border-radius: 5px;
            padding: 5px 20px;
            margin-left: 8px;
          }
          .genre-button {
            padding: 9px 11px;
            font-size: 12pt;
            border: 2px solid #303030;
            border-radius: 5px;
          }
          .genres {
            margin: 20px 0;
            position: relative;
          }
          .genres.all-selected .all-button {
            border: 1px solid white;
          }
          .genre-header {
            margin-top: 20px;
            font-size: 20pt;
          }
          .subgenres {
            max-width: 900px;
            margin: 0 auto;
          }
          .subgenre-header {
            font-size: 16pt;
            margin: 15px 0;
          }
          .subgenre-group {
            display: inline-block;
            margin: 5px 15px;
          }
          .subgenre-button {
            padding: 6px 10px;
            font-size: 10pt;
            border: 1px solid #303030;
            border-radius: 15px;
          }
          .submit-button {
            padding: 12px 15px;
            border: 2px solid #282828;
            border-radius: 5px;
          }
          .less-bold {
            font-weight: 100;
          }
          .separator {
            margin: 0 4px;
          }
        `}</style>
      </div>
  );
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
