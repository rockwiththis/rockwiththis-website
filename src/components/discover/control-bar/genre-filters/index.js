import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { keys, values, flatten, get, orderBy, isEqual } from 'lodash';
import { IoIosClose } from 'react-icons/io';
import $ from 'jquery';

export default class GenreFilters extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    resetSongs: PropTypes.func.isRequired,
    genres: PropTypes.exact({
      available: PropTypes.objectOf(PropTypes.string).isRequired,
      filters: PropTypes.objectOf(PropTypes.string).isRequired
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.modalRef = React.createRef();

    this.state = {
      selectedFilters: this.props.genres.filters
    }
  }

  componentDidUpdate = (prevProps, prevState) => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.hideOnClickOff);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.hideOnClickOff);
  }

  // TODO stop using this
  disableScrolling = () => $('body').css('overflow', 'hidden');
  enableScrolling = () => $('body').css('overflow', 'auto');

  closeModal = () => {
    this.props.hide();
    this.setState({
      selectedFilters: this.props.genres.filters
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
    const newGenreData = get(this.state.selectedFilters, [genreName, 'areAllSelected'])
      ? {
        areAllSelected: false,
        subgenres: {}
      }
      : {
        areAllSelected: true,
        subgenres: this.getAllAvailableKeyedSubgenres(genreName)
      };
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [genreName]: newGenreData
      }
    });
  }

  // Mark selected subgenre as set or unset
  // Always reset the parent genre
  toggleSubgenre = (genreName, subgenre) => {
    const currSubgenreData = get(this.state.selectedFilters, [genreName, 'subgenres'], {});
    const newSubgenreData = {
      ...currSubgenreData,
      [subgenre.id]: !!currSubgenreData[subgenre.id] ? undefined : subgenre
    }
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [genreName]: {
          areAllSelected: this.isEntireGenreSelected(genreName, newSubgenreData),
          subgenres: newSubgenreData
        }
      }
    });
  }

  resetFilterSelection = () =>
    this.setState({ selectedFilters: {} });

  getAllAvailableKeyedSubgenres = genreName =>
    get(this.props.genres.available, [genreName, 'subgenres'], [])
      .reduce((curr, next) => ({
        ...curr,
        [next.id]: next
      }), {});

  // Not the safest way to do this
  // If we notice bugs in this implementation, they are probably here
  isEntireGenreSelected = (genreName, subgenreData) => {
    const availableSubgenres = this.props.genres.available[genreName].subgenres
      .filter(sg => !sg.isHidden);

    const selectedSubgenres = values(subgenreData).filter(sg => !!sg);

    return availableSubgenres.length === selectedSubgenres.length;
  }

  getAllSelectedSubgenres = (filters = this.state.selectedFilters) =>
    flatten(values(filters).map(genre => (
      values(genre.subgenres).filter(sg => !!sg)
    )))

  areNoneSelected = () => this.getAllSelectedSubgenres().length === 0;

  getSelectedSubgenres = genreName =>
    values(get(this.state.selectedFilters, [genreName, 'subgenres']))
      .filter(sg => !!sg);

  areNoSubgenresSelected = genreName =>
    !this.state.selectedFilters[genreName] &&
    this.getSelectedSubgenres(genreName).length === 0;

  cssSafeGenreName = genreName =>
    genreName.replace('/', '-');

  getSubgenreButtonClass = (genreName, subgenreId) => {
    if (get(this.state.selectedFilters, [genreName, 'areAllSelected']))
      return ' included'
    else if (!!get(this.state.selectedFilters, [genreName, 'subgenres', subgenreId]))
      return ' selected'
    else
      return '';
  }

  submit = () => {
    const selectedSubgenreIds = this.getAllSelectedSubgenres().map(sg => sg.id);
    const currSubgenreIds = this.getAllSelectedSubgenres(this.props.genres.filters).map(sg => sg.id);

    if (!isEqual(selectedSubgenreIds.sort(), currSubgenreIds.sort()))
      this.props.resetSongs({ selectedGenreFilters: this.state.selectedFilters });

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
            keys(this.props.genres.available).length > 0 && !!this.state.selectedFilters ? (
              <div className="genre-filter-content" ref={this.modalRef}>

                <div className="close" onClick={() => this.closeModal()}><IoIosClose /></div>

                <div
                  className={
                    'genres' +
                    (this.areNoneSelected() ? ' all-selected' : '')
                  }
                >
                  <div className="genre-header">
                    <span><span className="less-bold">pick your</span> genres <span className="separator">|</span></span>
                    <div
                      className="gf-button all-button"
                      onClick={() => this.resetFilterSelection()}
                    >
                      reset
                    </div>
                  </div>

                  { keys(this.props.genres.available).map(genreName => (
                      <div
                        className={
                          `gf-button genre-button ${this.cssSafeGenreName(genreName)}` +
                          (get(this.state.selectedFilters, [genreName, 'areAllSelected']) ? ' selected' : '') +
                          (this.areNoneSelected() ? ' included' : '')
                        }
                        onClick={() => this.toggleGenre(genreName)}
                      >
                      <span>
                        { this.getGenreName(this.props.genres.available[genreName]) }
                      </span>
                      </div>
                  ))}
                </div>

                <div className='subgenres'>
                  <div
                    className={
                      'subgenre-header' +
                      (this.areNoneSelected() ? ' hide-mobile' : '')
                    }
                  >
                    <span className="less-bold">or your</span> subgenres
                  </div>

                  { keys(this.props.genres.available).map(genreName => (
                      <div
                        className={
                          `subgenre-group ${genreName}` +
                          (this.areNoSubgenresSelected(genreName) ? ' hide-mobile' : '')
                        }
                      >
                        {
                          orderBy(this.props.genres.available[genreName].subgenres, ['name'], ['asc']).map(subgenre => (
                            !subgenre.isHidden &&
                            <div
                              className={
                                `gf-button subgenre-button ${this.cssSafeGenreName(genreName)}` +
                                this.getSubgenreButtonClass(genreName, subgenre.id)
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
            opacity: .75;
          }
          .gf-button.selected {
            opacity: 1;
          }
          .gf-button.included {
            opacity: 1;
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
            max-width: 920px;
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
          .gf-button.dance-electronic.included, .gf-button.dance-electronic.selected {
            background: linear-gradient(to right, #3A1399, #0097d5);
          }
          .gf-button.chill.included, .gf-button.chill.selected {
            background: linear-gradient(to left, #39EF6C, #02870E);
          }
          .gf-button.hiphop.included, .gf-button.hiphop.selected {
            background: linear-gradient(to right, #000, #4D4D4D);
          }
          .gf-button.funk.included, .gf-button.funk.selected {
            background: linear-gradient(to right, #3023AE, #DB00FF);
          }
          .gf-button.soul.included, .gf-button.soul.selected {
            background: linear-gradient(to right, #3023AE, #ED1936);
          }
          .gf-button.rock.included, .gf-button.rock.selected {
            background: linear-gradient(to right, #0E018E, #C86DD7);
          }
          .gf-button.triphop.included, .gf-button.triphop.selected {
            background: linear-gradient(to right, #000000, #6B1CF7);
          }
          .gf-button.remix.included, .gf-button.remix.selected {
            background: linear-gradient(to right, #3A1399, #0097d5);
          }
          .gf-button.world.included, .gf-button.world.selected {
            background: linear-gradient(to right, #FF0000, #F76B1C);
          }
        `}</style>
      </div>
  );
}
