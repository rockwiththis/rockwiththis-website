import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SongPostContent extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
  }

  separateParagraphs = text => text.split(/\n+/g);

  render = () => (
      <div className="song-post-content">

        { this.separateParagraphs(this.props.songData.description).map((text, i) => (
            <p key={i}>{ text }</p>
        ))}

        <style jsx>{`
          .song-post-content {
            font-weight: 100;
          }
        `}</style>
      </div>
  )
}
