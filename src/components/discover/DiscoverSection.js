import React, { Component, Fragment } from 'react'
import YouTube from 'react-youtube'
import { Icon } from 'react-fa'
import { Element } from 'react-scroll'
import { Carousel } from 'react-responsive-carousel';
import { chunk } from 'lodash';

import FullView from './views/full-view';
import HeroPosts from 'components/HeroGrid/HeroPosts'
import SongGridSquare from 'components/SongGrid/SongGridSquare'
import Song from 'components/Song/Song'
import ShareBox from 'components/ShareBox/ShareBox'
import FiltersBar from 'components/FiltersBar/FiltersBar'
import LoadingComponent from 'components/Loading/LoadingComponent'
import black from 'images/black.jpg'
import HeroGridPlaceholder from 'components/HeroGridPlaceholder/HeroGridPlaceholder'
import PaginationControls from 'components/PaginationControls';
import * as Scroll from 'react-scroll'
import $ from 'jquery';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './stylesheets/DiscoverSection.scss'
import './stylesheets/GridView.scss'
import './stylesheets/SnapListView.scss'


/* eslint-disable */

class DiscoverSection extends Component {
  constructor(props) {
      super(props)
      this.state = {
        discoverFullSongIndex: 0,
        fixedFilterBar: false,
        disableScroll: true,
        loading: true
      }
  }

  componentWillMount() {
    this.setState({
      loading: false,
    })
  }


  componentDidMount() {
    window.addEventListener('scroll', this.fixedFiltersBar);
    window.addEventListener('scroll', this.handleMainPageScroll);

    //window.addEventListener('scroll', this.mobileLoadMore)
    window.addEventListener('scroll', this.enableDiscoverScroll);
    window.addEventListener('resize', this.enableDiscoverScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.fixedFiltersBar);
    window.removeEventListener('scroll', this.handleMainPageScroll);

    //window.removeEventListener('scroll', this.mobileLoadMore)
    window.removeEventListener('scroll', this.enableDiscoverScroll);
    window.removeEventListener('resize', this.enableDiscoverScroll);
  }

  /* Temporarily disabling in favor of pagination
  mobileLoadMore(event) {

    if ((window.innerWidth < 800) && (location.pathname == "/"))  {

      if (window.scrollY > (document.getElementById('songList').clientHeight - 400)) {

        if (this.state.loadingMoreSongs) {
          console.log("Cool your jets turbo");
        } else {
          console.log("Here's some more songs buddy!");

          this.setState({ loadingMoreSongs: true })
          this.props.actions.loadMoreSongs(() => this.setState({ loadingMoreSongs: false }))
        }
      }
    }
  }
  */

  /* Temporarily disabling in favor of pagination
  handleScroll = scrollEvent => {
    if (this.props.discoverLayout == "expanded"  && window.innerWidth > 800 )
      return;
    if (e.target.scrollTop > e.target.scrollHeight - (e.target.offsetHeight + 100))
      this.loadMoreSongs();
  }
  */

  fixedFiltersBar = () => {
    const heroElement = document.getElementById('hero-post');
    const headerElement = document.getElementById('header');

    if (!!heroElement && !!headerElement) {
      const scrollHeight = heroElement.clientHeight + headerElement.clientHeight - 12
      const fixedFilterBar = window.scrollY > scrollHeight

      this.setState({ fixedFilterBar })
    }
  }

  enableDiscoverScroll = () => {
    if (location.pathname == "/") {

      const scrollHeight = document.getElementById('hero-post').clientHeight
      window.scrollY > scrollHeight ? this.setState({ disableScroll: false }) : ''
      window.scrollY < scrollHeight ? this.setState({ disableScroll: true }) : ''
    }
  }

  loadMoreSongs = altCallback => {

    this.setState({ loadingMoreSongs: true })
    const callback = (noMorePosts) => {
      this.setState({
        loadingMoreSongs: false,
        noMorePosts
      }, altCallback)
    }
    if (!this.state.loadingMoreSongs) {

      this.props.actions.loadMoreSongs(callback)
    }
  }

  handleMainPageScroll = () => this.props.setMainPageScroll(window.scrollY);

  handleDiscoveryScroll = scrollEvent => this.props.setDiscoveryScroll(scrollEvent.target.scrollTop);

  showPreviousDiscoverSong = () => {
    const currIndex = this.getSpotlightPostIndex();

    if (this.props.filteredPosts.length % currIndex === 0)
      this.props.actions.loadPreviousSongs(true);
    else
      this.props.actions.updateSpotlightSong(
        this.props.filteredPosts[currIndex - 1]
      );
  }

  showNextDiscoverSong = () => {
    const newIndex = this.getSpotlightPostIndex() + 1;

    if (newIndex >= this.props.filteredPosts.length)
      this.props.actions.loadMoreSongs(null, true);
    else
      this.props.actions.updateSpotlightSong(
        this.props.filteredPosts[newIndex]
      );
  }

  isCurrentSong = song => song.id === this.props.activeSong.id

  changeSongOnEnd = () => {
    const nextIndex = this.props.filteredPosts.findIndex(this.isCurrentSong) + 1
    const nextQueuePosition = nextIndex >= this.props.filteredPosts.length ? 0 : nextQueuePosition

    this.props.actions.toggleSong(this.props.filteredPosts[nextQueuePosition])
  }

  getSpotlightPostIndex = () => (
      this.props.filteredPosts.findIndex(song => (
          song.id === this.props.spotlightPost.id
      ))
  );

  render() {
    const songGrids = []
    let individualGrid = []

    const indexTop = 0
    const songGridsFull = this.props.filteredPosts.map((song, index) => (
        <SongGridSquare
          {...this.props}
          index={index}
          activeDiscoverFullSong={this.props.spotlightPost.id === song.id}
          key={song.id}
          song={song}
        />
    ))

    const songList = this.props.songListPosts.map((song, index) => (
        <Song
          {...this.props}
          activeSong={this.props.activeSong}
          isPlaying={true}
          key={`${song.id}`}
          song={song}
          layout={this.props.discoverLayout}
        />
    ))

    const chunkLength = window.innerWidth > 1100 ? 32 : 8;
    const chunkedSongsGridsFull = chunk(songGridsFull, chunkLength);

    // const disableBack = this.props.posts[0] && this.props.posts[0].id === this.props.activeSong.id
    // Make this section look at `this.props.currentRequestLoading` to change display
    // when the filters are searched for.
    return (
        <div className="songsContainer clearfix">
          <div id="discover" className="discovery-section">
            <img className="discover-cover" src={black} />

              <FiltersBar {...this.props} />

              <div id="discovery-container"
                onScroll={this.handleDiscoveryScroll}
                className={`discovery-container ${this.state.disableScroll ? 'disableScroll' : ''} ${this.props.discoverLayout === 'snapshot' ? 'previewScrollLayout' : 'fullViewLayout'} ${this.props.discoverLayout === 'fullGrid' ? 'fullGridLayout' : ''}`}
              >
              {this.props.discoverLayout !== 'snapshot' &&
                <FullView songs={this.props.filteredPosts} />
              }

              {/*  SONG LIST - we should break this down into it's own component. The SONG LIST is a list of songs that can change between SNAP VIEW and FULL GRID view all with CSS. */}

                <div id="songList"  className={`songList ${this.state.fixedFilterBar ? 'fixedFiltersBarPadding' : ''}`}>
                  <div className="discoverySectionScroll" name='discoverySectionScroll'>

                    {songList}

                    <PaginationControls
                      currPageIndex={this.props.currentSongListPageIndex}
                      onForward={() => this.props.actions.loadMoreSongs()}
                      onBackward={() => this.props.actions.loadPreviousSongs()}
                    />

                  </div>
                </div>

              {/*  SONGS LIST  */}

              {this.state.loadingMoreSongs && !this.state.noMorePosts &&
                <div className='loading-bottom'>
                  <LoadingComponent />
                </div>
              }
              {this.state.noMorePosts &&
                <div className='loading-bottom'>
                  <span>No more posts to load.</span>
                </div>
              }

            </div>

          </div>
        </div>
    )
  }
}

export default DiscoverSection