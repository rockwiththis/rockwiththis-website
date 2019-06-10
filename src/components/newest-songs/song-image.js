import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

const hoverGradientImage = '/static/images/hero-hover-gradient.png';

class SongImage extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
    isSongOfTheDay: PropTypes.bool.isRequired
  }

  render = () => (
      <Link href={`/songs/${this.props.songData.id}`}>
        <div className="song-image">
          <img src={this.props.songData.image_url} />

          <div className="hover-content">
            <div className="genre-tags">
              {this.props.songData.sub_genres.map(tag =>
                <span key={tag.name}>{tag.name}</span>
              )}
            </div>
            <p className="page-link">Read More</p>
            <img className="hover-gradient" src={hoverGradientImage} />
          </div>
          {this.props.isSongOfTheDay &&
            <span className="song-of-day-tag">Song of the day</span>
          }
        </div>
      </Link>
  );
}

export default SongImage;
