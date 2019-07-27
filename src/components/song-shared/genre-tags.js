import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { slice } from 'lodash';

export default class GenreTags extends Component {

  static propTypes = {
    song: PropTypes.object.isRequired,
    firstOnly: PropTypes.bool
  }

  render = () => {
    const subgenres = this.props.firstOnly ?
      slice(this.props.song.sub_genres, 0, 1) :
      this.props.song.sub_genres;

    return (
        <span className="genre-tags">
          { subgenres.map(genre =>
              <span key={genre.name} className="genre-tag">{genre.name}</span>
          ) }
        </span>
    )
  }
}
