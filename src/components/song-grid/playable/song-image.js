import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link';

const hoverGradientImage = '/static/images/hero-hover-gradient.png';

class SongImage extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired,
  }

  render = () => {
    const songId = this.props.songData.id

    return (
        <Link href={`/songs/[id]?id=${songId}`} as={`/songs/${songId}`}>
          <div className="song-image-container">
            <img className="song-image" src={this.props.songData.image_url} />

            <div className="hover-content">
              <img className="hover-gradient" src={hoverGradientImage} />
              <div className="hover-text">
                <div className="genre-tags">
                  {this.props.songData.sub_genres.map(tag =>
                    <span className="genre-tag" key={tag.name}>{tag.name}</span>
                  )}
                </div>
                <p className="page-link">Read More</p>
              </div>
            </div>

            <style jsx>{`
              .song-image-container {
                position: relative;
                height: 100%;
                z-index: 1;
              }
              .song-image {
                width: 100%;
              }
              .hover-content {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
              }
              .hover-gradient {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                opacity: 0.5;
              }
              .hover-text {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                -webkit-transform: translateY(-50%);
                -ms-transform: translateY(-50%);
                text-align: center;
                width: 100%;
              }
              .genre-tags {
                position: relative;
                font-size: 16pt;
                line-height: 20pt;
                color: white;
                text-align: center;
              }
              .genre-tag {
                display: block;
                margin-top: -7px;
              }
              .page-link {
                color: white;
                font-size: 14px;
                background-color: #1a6ea9;
                display: inline-block;
                padding: 10px;
                border-radius: 6px;
              }
              .hover-gradient::hover {
                opacity: 0.7;
              }
            `}</style>
          </div>
        </Link>
    );
  }
}

export default SongImage;
