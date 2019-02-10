import React, { Component } from 'react'
import Song from 'components/Song/Song'

const propTypes = {
  songs: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFilterBarFixed: PropTypes.bool.isRequired,

  // from redux
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

  /* Temporarily disabling in favor of pagination
  handleScroll = scrollEvent => {
    if (this.props.discoverLayout == "expanded"  && window.innerWidth > 800 )
      return;
    if (e.target.scrollTop > e.target.scrollHeight - (e.target.offsetHeight + 100))
      this.loadMoreSongs();
  }
  */

  getFixedFilterBarClass = () =>
    this.props.isFilterBarFixed ? 'fixedFiltersBarPadding' : '';

  render() {
    return (
        <div
          id="songList" 
          className={`songList ${this.getFixedFilterBarClass()}`}
        >
          <div className="discoverySectionScroll">

            {this.props.songListPosts.map(song => (
                <Song key={`${song.id}`} song={song} />
            )}
          </div>

          {this.props.loadingSongs &&
            <div className='loading-bottom'>
              <LoadingComponent />
            </div>
          }
        </div>
    );
  }
}

DiscoverSection.propTypes = propTypes;

export default connect(
  ({ loadingSongs }) => { loadingSongs },
  { loadMoreSongs }
)(DiscoverSection);
