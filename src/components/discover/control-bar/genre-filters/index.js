import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, indexOf, flatten, map, filter } from 'lodash';
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
      selectedGenres: {},     // genre objects keyed by name
      selectedSubgenres: {}   // subgenre objects + `parentGenreName` keyed by id
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
  toggleGenre = genreName =>
    this.setState({
      ...this.state,
      selectedGenres: {
        ...this.state.selectedGenres,
        [genreName]: !!this.state.selectedGenres[genreName] ?
          undefined : this.props.genres[genreName]
      },
      selectedSubgenres:
        this.props.genres[genreName].subgenres.reduce(
          (currSubgenres, subgenreToRemove) => ({
            ...currSubgenres,
            [subgenreToRemove.id]: undefined
          }),
          this.state.selectedSubgenres
        )
    })

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
          undefined : { ...subgenre, parentGenreName: genreName }
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

  // genre + no subgenres w/ parent genreName selected
  shouldHideSubgenreGroupMobile = genreName =>
    !this.state.selectedGenres[genreName] &&
    indexOf(
      map(Object.values(this.state.selectedSubgenres), 'parentGenreName'),
      genreName
    ) === -1

  submit = () => {
    const allSubgenres = flatten(ALL_GENRES.map(genreName => {

      const genreSubgenres = this.state.selectedGenres[genreName] ?
        this.props.genres[genreName].subgenres : []

      const individualSubgenres = filter(
        Object.values(this.state.selectedSubgenres),
        subgenre => subgenre && subgenre.parentGenreName === genreName
      );

      return [
        ...genreSubgenres,
        ...individualSubgenres
      ]
    }));

    if (map(allSubgenres, s => s.id) !== map(this.props.subgenreFilters, s => s.id))
      this.props.resetSongs({ subgenreFilters: allSubgenres });

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
                            (!!this.state.selectedGenres[genreName] ? ' selected' : '') +
                            (this.areAllGenresSelected() ? ' included' : '')
                          }
                          onClick={() => this.toggleGenre(genreName)}
                        >
                          { this.getGenreName(this.props.genres[genreName]) }
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
                                  'gf-button subgenre-button' +
                                  (!!this.state.selectedSubgenres[subgenre.id] ? ' selected' : '') +
                                  (!!this.state.selectedGenres[genreName] ? ' included' : '')
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
