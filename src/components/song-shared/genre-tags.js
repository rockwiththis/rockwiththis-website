import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class GenreTags extends Component {

  static propTypes = {
    song: PropTypes.object.isRequired
  }

  render = () => (
      <span className="genre-tags">
        { this.props.song.sub_genres.map(genre =>
            <span key={genre.name} className="genre-tag">{genre.name}</span>
        ) }
      </span>
  )
}
