import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';

import SongPost from 'components/song-post';
import Loading from './loading-more-songs';

export default class ListView extends Component {

  static propTypes = {
    filteredSongPosts: PropTypes.array.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired,
    songDataFunctions: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.mobileLoadMore)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.mobileLoadMore)
  }

  mobileLoadMore = () => {
    if (window.innerWidth < 800) return;

    const songListElement = document.getElementById('songList');
    const shouldLoadMore = (
      !!songListElement &&
      window.scrollY > songListElement - 400 &&
      !this.props.songDataFunctions.isLoading
    );
    if (shouldLoadMore) this.props.songDataFunctions.loadMore();
  }

  handleScroll = event => {
    const scrollThreshold = event.target.scrollHeight - (event.target.offsetHeight + 100)
    const shouldLoadMore = (
      window.innerWidth >= 800 &&
      event.target.scrollTop > scrollThreshold &&
      !this.props.songDataFunctions.isLoading
    );
    if (shouldLoadMore) this.props.songDataFunctions.loadMore();
  }

  render() {
    return (
        <div className="list-view">
          {this.props.filteredSongPosts.map(songData => (
              <div className="list-view-song">
                <SongPost
                  key={songData.id}
                  songData={songData}
                  songPlayStatus={this.props.songPlayStatusForSong(songData)}
                  songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
                />
                <Link href={`songs/ ${songData.id}`}>
                  <div className="see-more">
                    ...see more
                    <IoIosArrowForward />
                  </div>
                </Link>
                <hr />
              </div>
          ))}

          {this.props.songDataFunctions.isLoading &&
            <div className='loading-bottom'>
              <Loading />
            </div>
          }

        <style jsx>{`
          .list-view {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding-top: 20px;
          }
          .list-view-song {
            width: 48%;
            height: 250px;
            display: inline-block;
            vertical-align: top;
            margin: 20px 1%;
            overflow: hidden;
          }
          .see-more {
            margin: 15px 0;
            font-size: 10pt;
            text-align: right;
          }
        `}</style>
        <style jsx global>{`
          .list-view .song-image {
            width: 35%;
          }
          .list-view .header-title {
            // -40% for image, -20px for padding, -50px for play button
            width: calc(65% - 20px - 40px);
            font-size: 16pt;
          }
          .list-view .spotify-link {
            display: none;
          }
          .list-view .song-post-content {
            height: 125px;
            position: relative;
            overflow: hidden;
          }
          .list -view .meta-info {
            font-size: 12pt;
          }
          .list-view .song-post-content p {
            margin: 0;
            font-size: 10pt;
            line-height: 20pt;
          }
          .list-view .outline-single-song-controls {
            width: 40px;
            height: 40px;
          }
        `}</style>
        </div>
    );
  }
}
