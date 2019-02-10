import React, { Component } from 'react';

import FiltersBar from 'components/FiltersBar/FiltersBar';
import FullView from './views/full-view';
import ListView from './views/list-view';
import black from 'images/black.jpg';

import './stylesheets/DiscoverSection.scss';
import './stylesheets/GridView.scss';
import './stylesheets/SnapListView.scss';

class DiscoverSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFilterBarFixed: false,
      disableScroll: true
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.updateFixedFilterBarFlag);
    window.addEventListener('scroll', this.handleMainPageScroll);
    window.addEventListener('scroll', this.enableDiscoverScroll);
    window.addEventListener('resize', this.enableDiscoverScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateFixedFilterBarFlag);
    window.removeEventListener('scroll', this.handleMainPageScroll);
    window.removeEventListener('scroll', this.enableDiscoverScroll);
    window.removeEventListener('resize', this.enableDiscoverScroll);
  }

  updateFixedFilterBarFlag = () => {
    const heroElement = document.getElementById('hero-post');
    const headerElement = document.getElementById('header');

    if (!!heroElement && !!headerElement) {
      const scrollHeight = heroElement.clientHeight + headerElement.clientHeight - 12
      const isFilterBarFixed = window.scrollY > scrollHeight

      this.setState({ isFilterBarFixed })
    }
  }

  enableDiscoverScroll = () => {
    const scrollHeight = document.getElementById('hero-post').clientHeight;
    if (window.scrollY > scrollHeight)
      this.setState({ disableScroll: false })
    else
      this.setState({ disableScroll: true })
  }

  handleMainPageScroll = () => this.props.setMainPageScroll(window.scrollY);

  handleDiscoveryScroll = scrollEvent => this.props.setDiscoveryScroll(scrollEvent.target.scrollTop);

  isCurrentSong = song => song.id === this.props.activeSong.id;

  render() {
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

                {/* TODO move render logic here instead */}
                <ListView
                  songs={this.props.filteredPosts}
                  isFilterBarFixed={this.state.isFilterBarFixed}
                />
            </div>

          </div>
        </div>
    )
  }
}

export default DiscoverSection
