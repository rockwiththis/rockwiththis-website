import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loadMoreSongs } from 'actions';
import Song from 'components/Song/Song';
import LoadingComponent from 'components/Loading/LoadingComponent';

const propTypes = {
  isFilterBarFixed: PropTypes.bool.isRequired,

  // from redux
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadingSongs: PropTypes.bool.isRequired,
  loadMoreSongs: PropTypes.func.isRequired
}

class ListView extends Component {

  componentDidMount = () => {
    window.addEventListener('scroll', this.mobileLoadMore)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.mobileLoadMore)
  }

  mobileLoadMore = event => {
    const scrollThreshold = document.getElementById('songList').clientHeight - 400;
    const shouldLoadMore = (
      window.innerWidth < 800 &&
      window.scrollY > scrollThreshold &&
      !this.props.loadingSongs
    );
    if (shouldLoadMore) this.props.loadMoreSongs();
  }

  handleScroll = event => {
    const scrollThreshold = event.target.scrollHeight - (event.target.offsetHeight + 100)
    const shouldLoadMore = (
      window.innerWidth >= 800 &&
      event.target.scrollTop > scrollThreshold &&
      !this.props.loadingSongs
    );
    if (shouldLoadMore) this.props.loadMoreSongs();
  }

  getFixedFilterBarClass = () =>
    this.props.isFilterBarFixed ? 'fixedFiltersBarPadding' : '';

  render() {
    return (
        <div
          id="songList" 
          className={`songList ${this.getFixedFilterBarClass()}`}
          onScroll={this.handleScroll}
        >
          {this.props.songs.map(song => (
              <Song key={song.id} song={song} />
          ))}

          {this.props.loadingSongs &&
            <div className='loading-bottom'>
              <LoadingComponent />
            </div>
          }
        </div>
    );
  }
}

ListView.propTypes = propTypes;

export default connect(
  ({ filteredPosts, loadingSongs }) => ({
    songs: filteredPosts,
    loadingSongs
  }),
  { loadMoreSongs }
)(ListView);
