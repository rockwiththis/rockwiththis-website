import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'
import { Icon } from 'react-fa'
import { Element } from 'react-scroll'
import { Carousel } from 'react-responsive-carousel';
import { chunk } from 'lodash';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import HeroPosts from 'components/HeroGrid/HeroPosts'
import SongGridSquare from 'components/SongGrid/SongGridSquare'
import Song from 'components/Song/Song'
import ShareBox from 'components/ShareBox/ShareBox'
import FiltersBar from 'components/FiltersBar/FiltersBar'
import LoadingComponent from 'components/Loading/LoadingComponent'
import black from 'images/black.jpg'
import FullSongPlaceHolder from 'components/FullSongPlaceholder/FullSongPlaceholder'
import SongGridPlaceholder from 'components/SongGridPlaceholder/SongGridPlaceholder'
import HeroGridPlaceholder from 'components/HeroGridPlaceholder/HeroGridPlaceholder'
import SongPlayerContainer from 'components/SongPlayer/SongPlayerContainer';
import PaginationControls from 'components/PaginationControls';

/* eslint-disable */

class SongsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          discoverFullSongIndex: 0,
          fixedFilterBar: false,
          disableScroll: true,
          loading: true,
          totalCarouselPages: 1
        }

        //this.handleScroll = this.handleScroll.bind(this)
        this.loadMoreSongs = this.loadMoreSongs.bind(this)
        this.changeDiscoverSong = this.changeDiscoverSong.bind(this)
        this.fixedFiltersBar = this.fixedFiltersBar.bind(this)
        this.enableDiscoverScroll = this.enableDiscoverScroll.bind(this)
        this.mobileLoadMore = this.mobileLoadMore.bind(this)
    }

    componentWillMount() {
      this.setState({
        loading: false,
      })
    }


    componentDidMount() {
      window.addEventListener('scroll', this.fixedFiltersBar);
      window.addEventListener('scroll', this.fixedFiltersBar);

      window.addEventListener('scroll', this.mobileLoadMore)
      window.addEventListener('scroll', this.enableDiscoverScroll);
      window.addEventListener('resize', this.enableDiscoverScroll);
    }

    componentWillUnmount() {
      window.addEventListener('scroll', this.fixedFiltersBar);
      window.addEventListener('scroll', this.fixedFiltersBar);

      //window.addEventListener('scroll', this.mobileLoadMore)
      window.addEventListener('scroll', this.enableDiscoverScroll);
      window.addEventListener('resize', this.enableDiscoverScroll);
    }

    handleMainContainerScroll(event) {
      console.log(event)
    }

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

    componentWillReceiveProps(nextProps) {
        if (this.props.isPlaying !== nextProps.isPlaying ||
            this.props.activeSong !== nextProps.activeSong) {

        }
    }

    fixedFiltersBar() {

      if (location.pathname == "/") {
        const scrollHeight = (document.getElementById('hero-post').clientHeight + document.getElementById('header').clientHeight - 12)
        const fixedFilterBar = window.scrollY > scrollHeight
        this.setState({ fixedFilterBar })
      }
    }

    loadMoreSongs(altCallback) {

      this.setState({ loadingMoreSongs: true })
      const callback = (noMorePosts) => {
        this.setState({
          loadingMoreSongs: false,
          noMorePosts,
          totalCarouselPages: this.state.totalCarouselPages + 1
        }, altCallback)
      }
      if (!this.state.loadingMoreSongs) {

        this.props.actions.loadMoreSongs(callback)
      }
    }

    /* Temporarily disabling in favor of pagination
    handleScroll(e) {
      if (this.props.discoverLayout == "expanded"  && window.innerWidth > 800 )
        return;
      if (e.target.scrollTop > e.target.scrollHeight - (e.target.offsetHeight + 100))
        this.loadMoreSongs();
    }
    */

    // This is currently not supported but it's cool b/c im pretty sure the arrows are hidden anyway
    changeDiscoverSong(increment) {
        let newIndex = increment ? this.state.discoverFullSongIndex + 1 :
          this.state.discoverFullSongIndex - 1
        if(newIndex == this.props.filteredPosts.length){
          this.loadMoreSongs()
        }
        if(newIndex == -1){
          newIndex = this.props.filteredPosts.length - 1
        }
        this.setState({ discoverFullSongIndex: newIndex })
    }

    enableDiscoverScroll() {
      if (location.pathname == "/") {

        const scrollHeight = document.getElementById('hero-post').clientHeight + 45
        window.scrollY > scrollHeight ? this.setState({ disableScroll: false }) : ''
        window.scrollY < scrollHeight ? this.setState({ disableScroll: true }) : ''
      }
    }

    setSongDuration = ref => {
      this.props.actions.setSongDuration(ref.getDuration());
    }

    isCurrentSong = song => song.id === this.props.activeSong.id

    changeSongOnEnd = () => {
      const nextIndex = this.props.filteredPosts.findIndex(this.isCurrentSong) + 1
      const nextQueuePosition = nextIndex >= this.props.filteredPosts.length ? 0 : nextQueuePosition

      this.props.actions.toggleSong(this.props.filteredPosts[nextQueuePosition])
    }

    getSnapshotPostIndex = () => (
        this.props.filteredPosts.findIndex(song => (
            song.id === this.props.snapshotPost.id
        ))
    );

    getAllPlayableSongs = () => ([
      ...this.props.heroPosts,
      this.props.snapshotPost,
      ...this.props.songListPosts
    ]);

    render() {
      const songGrids = []
      let individualGrid = []

      const indexTop = 0
      const songGridsFull = this.props.filteredPosts.map((song, index) => (
          <SongGridSquare
            {...this.props}
            index={index}
            activeDiscoverFullSong={this.props.snapshotPost.id === song.id}
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

      const chunkLength = window.innerWidth > 1100 ? 16 : 8;
      const chunkedSongsGridsFull = chunk(songGridsFull, chunkLength);

      // const disableBack = this.props.posts[0] && this.props.posts[0].id === this.props.activeSong.id
      // Make this section look at `this.props.currentRequestLoading` to change display
      // when the filters are searched for.
      return (
          <div className="songsContainer clearfix">

            <HeroPosts
              {...this.props}
              heroPosts={this.props.heroPosts}
            />

            <div id="discover" className="discovery-section">
              <img className="discover-cover" src={black} />

              <Element>
                <FiltersBar {...this.props} resetGridPage={this.props.actions.resetLoadedSongs}/>
              </Element>

              <div id='discoverSongsWrapper' className='discover-songs-wrapper'>
                <div id="discovery-container"
                  //onScroll={(e) => this.handleScroll(e)}
                  className={`discovery-container ${this.state.disableScroll ? 'disableScroll' : ''} ${this.props.discoverLayout === 'snapshot' ? 'previewScrollLayout' : ''} ${this.props.discoverLayout === 'fullGrid' ? 'fullGridLayout' : ''}`}
                >

                  <div id="songList" className={`songList ${this.state.fixedFilterBar ? 'fixedFiltersBarPadding' : ''}`}>
                    <div className="discoverySectionScroll" name='discoverySectionScroll'>

                      <PaginationControls
                        currPageIndex={this.props.currentSongListPageIndex}
                        onForward={() => this.props.actions.loadMoreSongs()}
                        onBackward={this.props.actions.loadPreviousSongs}
                      />

                      {songList}

                      <PaginationControls
                        currPageIndex={this.props.currentSongListPageIndex}
                        onForward={() => this.props.actions.loadMoreSongs()}
                        onBackward={this.props.actions.loadPreviousSongs}
                      />

                    </div>
                  </div>

                  {this.props.discoverLayout !== 'snapshot' &&
                    <div className="snapshotView">

                      <div className="songGrid">

                        {songGridsFull.length > 0 ?
                          <div className='grid-container-wrapper'>
                            <Carousel
                              showThumbs={false}
                              showStatus={false}
                              showIndicators={false}
                              selectedItem={this.props.currentSongListPageIndex}
                              useKeyboardArrows={true}
                            >
                              { chunkedSongsGridsFull.map(grid => (
                                <div className='grid-container'>
                                  {grid}
                                </div>
                              )) }
                            </Carousel>
                          </div>
                        :
                          <SongGridPlaceholder />
                        }

                        <PaginationControls
                          currPageIndex={this.props.currentSongListPageIndex}
                          onForward={() => this.props.actions.loadMoreSongs()}
                          onBackward={this.props.actions.loadPreviousSongs}
                        />

                      </div>

                      <div className="discover-full-song">

                        {this.state.loading ?
                          <FullSongPlaceHolder />
                        :
                          <div>
                            <button
                              className="toggle-song previous"
                              onClick={() => this.changeDiscoverSong(false)}
                            >
                              <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
                            </button>

                            <div className='carousel-wrapper'>
                              {this.props.snapshotPost.id && this.props.filteredPosts[0] &&
                                <Carousel
                                  showThumbs={false}
                                  showStatus={false}
                                  showArrows={false}
                                  infiniteLoop
                                  selectedItem={this.getSnapshotPostIndex()}
                                  ref={(e) => this.carousel = e}
                                >
                                  {this.props.filteredPosts.map(post => (
                                    <div>
                                      <Song
                                        {...this.props}
                                        song={post}
                                      />
                                    </div>
                                  ))}
                                </Carousel>
                              }
                            </div>

                            <button
                              className="toggle-song next"
                              onClick={() => this.changeDiscoverSong(true)}
                            >
                              <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                  }


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

            <SongPlayerContainer
              songPosts={this.getAllPlayableSongs()}
              currentSongId={this.props.activeSong.id}
              isPlaying={this.props.isPlaying}
              onSongProgress={this.props.actions.setSongProgress}
              onSongEnd={this.changeSongOnEnd}
            />
          </div>
      )
    }
}

export default SongsContainer
