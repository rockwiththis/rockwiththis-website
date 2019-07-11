import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Desktop from './desktop';
import Mobile from './mobile';
import Loading from '../loading-more-songs';

export const propTypes = {
  filteredSongPosts: PropTypes.array.isRequired,
  songPlayStatusForSong: PropTypes.func.isRequired,
  songPlayerFunctionsForSong: PropTypes.func.isRequired,
  songDataFunctions: PropTypes.object.isRequired
}

export default class GridListView extends Component {

  static propTypes = propTypes

  // TODO load more on scroll

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

  render = () => (
      <div className="grid-list-view">
        <Desktop {...this.props} />
        <Mobile {...this.props} />

        {this.props.songDataFunctions.isLoading &&
          <div className='loading-bottom'>
            <Loading />
          </div>
        }

        <style jsx>{`
          .grid-list-view {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
          }
        `}</style>
        <style jsx global>{`
          @media (min-width: 800px) {
            .grid-list-view .grid-list-view-mobile {
              display: none
            }
          }
          @media (max-width: 800px) {
            .grid-list-view .grid-list-view-desktop {
              display: none
            }
          }
        `}</style>
      </div>
  );
}
