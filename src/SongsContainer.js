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

/* eslint-disable */

class SongsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          discoverFullSongIndex: 0,
          fixedFilterBar: false,
          disableScroll: true,
          loading: true,
          gridPage: 0,
          totalCarouselPages: 1
        }

        this.handleScroll = this.handleScroll.bind(this)
        this.loadMoreSongs = this.loadMoreSongs.bind(this)
        this.changeDiscoverSong = this.changeDiscoverSong.bind(this)
        this.updateDiscoverFullSongIndex = this.updateDiscoverFullSongIndex.bind(this)
        this.fixedFiltersBar = this.fixedFiltersBar.bind(this)
        this.enableDiscoverScroll = this.enableDiscoverScroll.bind(this)
        this.navGrid = this.navGrid.bind(this)
        this.handleCarousel = this.handleCarousel.bind(this)
        this.mobileLoadMore = this.mobileLoadMore.bind(this)
    }

    componentWillMount() {
      this.setState({
        loading: false,
      })
    }


    componentDidMount() {

        window.addEventListener('scroll', this.fixedFiltersBar)
        window.addEventListener('scroll', this.fixedFiltersBar)

        window.addEventListener('scroll', this.mobileLoadMore)
        window.addEventListener('scroll', this.enableDiscoverScroll)
        window.addEventListener('resize', this.enableDiscoverScroll);

    }

    componentWillUnmount() {
      window.addEventListener('scroll', this.fixedFiltersBar)
      window.addEventListener('scroll', this.fixedFiltersBar)

      window.addEventListener('scroll', this.mobileLoadMore)
      window.addEventListener('scroll', this.enableDiscoverScroll)
      window.addEventListener('resize', this.enableDiscoverScroll);    }

    mobileLoadMore() {

      // console.log(document.getElementById('songList').clientHeight);
      // console.log(window.scrollY);

      // if ((window.innerWidth < 800) && (location.pathname == "/"))  {
      //
      //   if (window.scrollY > (document.getElementById('songList').clientHeight - 400)) {
      //    console.log("Here's some more songs buddy!");

               // this.setState({ loadingMoreSongs: true })
               // const callback = (noMorePosts) => {
               //   this.setState({
               //     loadingMoreSongs: false,
               //     noMorePosts,
               //     totalCarouselPages: this.state.totalCarouselPages + 1
               //   })
               // }
               //   this.props.actions.loadMoreSongs(callback)

      //  }
      // }

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

    navGrid(e) {
      let num = 0
      if (e){
        num = this.state.gridPage + 1
      } else if (!e && this.state.gridPage != 0){
        console.log("backing")
        this.setState({
          gridPage: this.state.gridPage - 1,
        })
      }
      const changePage = () => {
        this.setState({
          gridPage: num,
        })
      }
      if (num + 1 > this.state.totalCarouselPages && num > this.state.gridPage) {
        this.loadMoreSongs(changePage)
      } else if (num > this.state.gridPage) {
        changePage()
      }
      //const num = e ? this.state.gridPage + 1 : this.state.gridPage - 1

    }

    handleCarousel() {

      this.setState({
        discoverFullSongIndex: this.carousel.state.selectedItem
      })
    }

    handleScroll(e) {

        if (this.props.discoverLayout == "expanded"  && window.innerWidth > 800 ) {
          return;
        }

        if (e.target.scrollTop > e.target.scrollHeight - (e.target.offsetHeight + 100)) {
            this.loadMoreSongs()
        }



        // console.log("e.target", e.target);
        console.log("e.target.scrollTop", e.target.scrollTop);
        console.log("e.target.scrollHeight", e.target.scrollHeight);
        console.log("e.target.offsetHeight", e.target.offsetHeight);
    }

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

    updateDiscoverFullSongIndex(e) {
        this.setState({
            discoverFullSongIndex: Number(e.currentTarget.dataset.index)
        })
    }


    enableDiscoverScroll() {
      if (location.pathname == "/") {

        const scrollHeight = document.getElementById('hero-post').clientHeight + 45
        window.scrollY > scrollHeight ? this.setState({ disableScroll: false }) : ''
        window.scrollY < scrollHeight ? this.setState({ disableScroll: true }) : ''
    }
    }

    renderPaginationDots() {
      if (this.state.gridPage == 0) {
        return(
          <div className="pagination-container">
            <button className='pagination-dot pagination-dot-active'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot-small'/>
          </div>
        );
      }
      if (this.state.gridPage == 1) {
        return(
          <div className="pagination-container">
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot pagination-dot-active'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot-small'/>
          </div>
        );
      }
      if (this.state.gridPage == 2) {
        return(
          <div className="pagination-container">
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot pagination-dot-active'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot-small'/>
          </div>
        );
      }
      if (this.state.gridPage == 3) {
        return(
          <div className="pagination-container">
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot pagination-dot-active'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot-small'/>
          </div>
        );
      }
      if (this.state.gridPage > 3) {
        return(
          <div className="pagination-container">
            <button className='pagination-dot-small'/>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot pagination-dot-active'><i className="fas fa-circle"></i></button>
            <button className='pagination-dot-small'/>
          </div>
        );
      }
    }

    resetGridPage = () => {
      this.setState({ gridPage: 0 })
    }

    render() {



        const { discoverFullSongIndex } = this.state
        const heroPosts = this.props.posts.slice(0,7)
        const songGrids = []
        let individualGrid = []

        const indexTop = 0
        const songGridsFull = this.props.filteredPosts.map((song, index) => {
            return (
                <SongGridSquare
                    {...this.props}
                    index={(indexTop == 0) ? index : index + (indexTop)*16}
                    activeDiscoverFullSong={this.state.discoverFullSongIndex === ((indexTop == 0) ? index : index + (indexTop)*16)}
                    updateDiscoverFullSongIndex={this.updateDiscoverFullSongIndex}
                    key={song.id}
                    song={song}
                />
            )
        })


        const songList = this.props.filteredPosts.map((song, index) => {
          return(
            <Song
                {...this.props}
                activeSong={this.props.activeSong}
                isPlaying={true}
                key={`${song.id}`}
                song={song}
                layout={this.props.discoverLayout}
            />
          )
        })

        const chunkLength = window.innerWidth > 1100 ? 16 : 8;
        const chunkedSongsGridsFull = chunk(songGridsFull, chunkLength);

        // const disableBack = this.props.posts[0] && this.props.posts[0].id === this.props.activeSong.id
        // Make this section look at `this.props.currentRequestLoading` to change display
        // when the filters are searched for.
        return (
            <div className="songsContainer clearfix">
                <HeroPosts
                    {...this.props}
                    heroPosts={heroPosts}
                />

              <div id="discover" className="discovery-section">
              <img className="discover-cover" src={black} />

                <Element >
                  <FiltersBar {...this.props} resetGridPage={this.resetGridPage}/>
                </Element>
                <div id='discoverSongsWrapper' className='discover-songs-wrapper'>
                  <div id="discovery-container" onScroll={(e) => this.handleScroll(e)} className={`discovery-container ${this.state.disableScroll ? 'disableScroll' : ''} ${this.props.discoverLayout === 'snapshot' ? 'previewScrollLayout' : ''} ${this.props.discoverLayout === 'fullGrid' ? 'fullGridLayout' : ''}`}>
                    {this.props.discoverLayout !== 'snapshot' &&

                      <div className="songGrid">

                      {songGridsFull.length > 0 ?

                            <div className='grid-container-wrapper'>
                              <Carousel
                                showThumbs={false}
                                showStatus={false}
                                showIndicators={false}
                                selectedItem={songGridsFull.length > 1 ? this.state.gridPage : null}
                                useKeyboardArrows={true}>

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
                          <div className='song-grid-footer'>
                            <button className='grid-arrow previous' onClick={() => this.navGrid(false)}>
                              <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
                            </button>
                            {this.renderPaginationDots()}
                            <button className='grid-arrow next' onClick={() => this.navGrid(true, songGridsFull.length)}>
                              <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
                            </button>
                          </div>
                      </div>


                    }
                    <div id="songList" className={`songList ${this.state.fixedFilterBar ? 'fixedFiltersBarPadding' : ''}`}>
                    <div  className="discoverySectionScroll" name='discoverySectionScroll' />
                      {songList}
                    </div>

                    {this.props.discoverLayout !== 'snapshot' &&
                      <div className="discover-full-song">

                      {this.state.loading ? <FullSongPlaceHolder />

                        :
                        <div>
                            <button
                            className="toggle-song previous" onClick={() => this.changeDiscoverSong(false)}>
                                <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
                            </button>
                            <div className='carousel-wrapper'>
                              {this.props.filteredPosts[discoverFullSongIndex] &&
                                  <Carousel
                                    showThumbs={false}
                                    showStatus={false}
                                    showArrows={false}
                                    infiniteLoop
                                    selectedItem={discoverFullSongIndex}
                                    ref={(e) => this.carousel = e}
                                  >
                                      {
                                        this.props.filteredPosts.map(post => {
                                          return (
                                            <div>
                                              <Song
                                                  {...this.props}
                                                  song={post}
                                              />
                                            </div>
                                          )
                                        })
                                      }
                                  </Carousel>
                              }
                            </div>
                            <button
                            className="toggle-song next" onClick={() => this.changeDiscoverSong(true)}>
                                <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
                            </button>
                          </div>
                      }

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
          </div>
        )
    }
}

export default SongsContainer
