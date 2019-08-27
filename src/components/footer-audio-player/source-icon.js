import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import SoundcloudIcon from 'components/icons/soundcloud';
import YoutubeIcon from 'components/icons/youtube';

export default class FooterPlayerSourceIcon extends Component {

  static propTypes = {
    activeSong: PropTypes.object.isRequired
  }

  songSoundcloudUrl = songData =>
    songData.soundcloud_link ||
    `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${songData.soundcloud_track_id}`;

  songYoutubeUrl = songData =>
    songData.youtube_link ||
    `https://www.youtube.com/watch?v=${songData.youtube_track_id}`;

  render = () => (
      <div className="footer-player-source-icon">
        { this.props.activeSong.soundcloud_track_id ?
            <Link href={this.songSoundcloudUrl(this.props.activeSong)}>
              <SoundcloudIcon />
            </Link>
            :
            <Link href={this.songYoutubeUrl(this.props.activeSong)}>
              <YoutubeIcon />
            </Link>
        }

        <style jsx>{`
          .footer-player-source-icon {
            padding-top: 15px;
            padding-right: 20px;
          }
        `}</style>
        <style jsx global>{`
          .footer-player-source-icon svg {
            fill: white;
          }
        `}</style>
      </div>
  );
}
