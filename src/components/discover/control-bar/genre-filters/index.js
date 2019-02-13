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
    this.modalRef = React.createRef();
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

  render() {
    return (
        <div
          className={
            'genre-filters' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
          <div className="modal-overlay"></div>

          <div className="modal-container" ref={this.modalRef}>
            <div className="modal">

              <div className="genre-header">pick your genres</div>

              <div className="genres">[Genre Buttons Here]</div>

              <div className="subgenre-separator">OR</div>

              <div className="subgenre-header">subgenres</div>

              <div className="subgenres">
                [Subgenre buttons here]
              </div>

              <button className="submit">submit</button>
            </div>
          </div>
        </div>
    )
  }
}

GenreFilters.propTypes = propTypes;

export default GenreFilters;
