import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

export default class RelatedSongs extends Component {

  static propTypes = {
    relatedSongsData: PropTypes.array.isRequired
  }

  render = () => {
    console.log("RELATED SONGS", this.props.relatedSongsData.slice(0,11));
    return (
      <div className="related-songs">

        <div className="title">Related Tracks</div>

        { this.props.relatedSongsData.map(relatedSong =>
            <Link href={`/songs/[id]?id=${relatedSong.id}`} as={`/songs/${relatedSong.id}`}>
              <img className="song-image" src={relatedSong.image_url} />
            </Link>
        )}

        <style jsx>{`
          .title {
            font-size: 10pt;
            text-align: center;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: white;
            padding-top: 15px;
            padding-bottom: 10px;
            background: #1a63a9;
            border: 1px solid white;
          }
          .song-image {
            width: 50%;
            box-sizing: border-box;
            border: 1px solid white;
            border-bottom: 0;
          }
        `}</style>
      </div>
  )}
}
