import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ControlBar from './control-bar';
import FullView from './views/full-view';
import ListView from './views/list-view';

import { setDiscoverScroll } from 'actions/scroll';

import black from 'images/black.jpg';

import './stylesheets/DiscoverSection.scss';
import './stylesheets/GridView.scss';
import './stylesheets/SnapListView.scss';


const propTypes = {
  // Redux
  discoverLayout: PropTypes.string.isRequired,
  discoverScrollPos: PropTypes.number,
  setDiscoverScroll: PropTypes.func.isRequired,
}

class DiscoverSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isControlBarFixed: false,
      disableScroll: true
    }
  }

  // TODO tracking window scroll should really be happening in pages/Homepage instead
  componentDidMount() {
    window.addEventListener('scroll', this.updateFixedControlBarFlag);
    window.addEventListener('scroll', this.enableDiscoverScroll);
    window.addEventListener('resize', this.enableDiscoverScroll);
    this.updateScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateFixedControlBarFlag);
    window.removeEventListener('scroll', this.enableDiscoverScroll);
    window.removeEventListener('resize', this.enableDiscoverScroll);
  }

  componentDidUpdate = () => this.updateScroll();

  updateScroll = () => {
    const discoveryContainer = document.getElementById('discovery-container');
    if (!!discoveryContainer)
      discoveryContainer.scrollTop = this.props.discoverScrollPos;
  }

  // TODO tracking window scroll should really be happening in pages/Homepage instead
  updateFixedControlBarFlag = () => {
    const heroElement = document.getElementById('hero-post');
    const headerElement = document.getElementById('header');

    if (!!heroElement && !!headerElement) {
      const scrollHeight = heroElement.clientHeight + headerElement.clientHeight - 12
      const isControlBarFixed = window.scrollY > scrollHeight

      this.setState({ isControlBarFixed })
    }
  }

  // TODO tracking window scroll should really be happening in pages/Homepage instead
  enableDiscoverScroll = () => {
    const scrollHeight = document.getElementById('hero-post').clientHeight;
    if (window.scrollY > scrollHeight)
      this.setState({ disableScroll: false })
    else
      this.setState({ disableScroll: true })
  }

  render() {
    return (
        <div className="songsContainer clearfix">
          <div id="discover" className="discovery-section">
            <img className="discover-cover" src={black} />

            <ControlBar isControlBarFixed={this.state.isControlBarFixed} />

            <div
              id="discovery-container"
              name="discovery-container"
              onScroll={e => this.props.setDiscoverScroll(e.target.scrollTop)}
              className={`discovery-container ${this.state.disableScroll ? 'disableScroll' : ''} ${this.props.discoverLayout === 'snapshot' ? 'previewScrollLayout' : 'fullViewLayout'} ${this.props.discoverLayout === 'fullGrid' ? 'fullGridLayout' : ''}`}
            >
              {
                this.props.discoverLayout !== 'snapshot' &&
                <FullView />
              }

              {/* TODO move render logic here instead */}
              <ListView isControlBarFixed={this.state.isControlBarFixed} />
            </div>

          </div>
        </div>
    )
  }
}

export default connect(
  ({ discoverLayout, discoverScrollPos }) => ({ discoverLayout, discoverScrollPos }),
  { setDiscoverScroll }
)(DiscoverSection)
