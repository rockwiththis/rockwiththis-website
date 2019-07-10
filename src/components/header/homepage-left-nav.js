import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { animateScroll } from 'react-scroll';

export default class HomepageLeftNav extends Component {

  static propTypes = {
    scroll: PropTypes.object
  }

  render = () => (
      <div className="homepage-left-nav">
        <div
          className={
            'nav-link nav-this-week' +
            (!this.props.scroll.scrolledToDiscover ? ' active' : '')
          }
          onClick={this.props.scroll.scrollToTop}
        >
          This Week
        </div>
        <div
          className={
            'nav-link nav-discover' +
            (this.props.scroll.scrolledToDiscover ? ' active' : '')
          }
          onClick={this.props.scroll.scrollToDiscover}
        >
          Discover
        </div>
        <div
          className='nav-link nav-home active'
          onClick={this.props.scroll.scrollToTop}
        >
          Home
        </div>

        <style jsx>{`
          .homepage-left-nav {
            margin-top: 5px;
          }
          @media (max-width: 1000px) {
            .nav-this-week, .nav-discover {
              display: none;
            }
          }
          @media (min-width: 1000px) {
            .nav-home {
              display: none;
            }
          }
        `}</style>
      </div>
  )
}
