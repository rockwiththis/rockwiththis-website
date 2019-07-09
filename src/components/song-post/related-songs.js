import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class RelatedSongs extends Component {

  static propTypes = {
    relatedSongsData: PropTypes.array.isRequired
  }

  render = () => (
      <div className="related-songs">

        <p className="title">Related Tracks</p>

        { this.props.relatedSongsData.slice(0, 11).map(relatedSong =>
            <Link
              key={relatedSong.id}
              href={`/songs/[id]?id=${relatedSong.id}`}
              as={`/songs/${relatedSong.id}`}
            >
              <img className="song-image" src={relatedSong.image_url} />
            </Link>
        )}
      </div>
  )
}
