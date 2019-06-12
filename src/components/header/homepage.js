import React, { Component } from 'react'
import { animateScroll } from 'react-scroll';

const desktopLogo = '/static/images/RWT-Hortizontal-Logo-Vector.svg'
const mobileLogo = '/static/images/RWT_HeadLogo.svg'

export default class HomepageHeader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scrolledToDiscover: false,
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.updateScrolledToDiscover)
    window.addEventListener('resize', this.updateScrolledToDiscover)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.updateScrolledToDiscover)
    window.removeEventListener('resize', this.updateScrolledToDiscover)
  }

  getNewestSongsElement = () => document.getElementById('newest-songns');

  // TODO better scroll anchoring + control
  updateScrolledToDiscover = () => {
    const newestSongsElement = this.getNewestSongsElement();
    const scrolledToDiscover = (
      newestSongsElement &&
      newestSongsElement.clientHeight + 45 > window.scrollY
    );
    this.setState({ scrolledToDiscover })
  }

  scrollToDiscover = () => {
    const newestSongsElement = this.getNewestSongsElement();
    if (!!newestSongsElement)
      animateScroll.scrollTo(newestSongsElement.clientHeight + 45);
  }

  scrollToTop = () => {
    this.setState({ scrolledToDiscover: false });
    animateScroll.scrollTo(0);
  }

  render = () => (
      <div id="homepage-header">

        <div className="nav-left">
          <div
            className={`nav-link nav-week ${!this.state.scrolledToDiscover ? 'active' : ''}`}
            onClick={this.scrollToTop}
          >
            This Week
          </div>
          <div
            className={`nav-link nav-discover ${this.state.scrolledToDiscover ? 'active' : ''}`}
            onClick={this.scrollToDiscover}
          >
            Discover
          </div>
          {/* TODO is this really needed? */}
          <div
            className="nav-link nav-submit"
            to="/"
            activeClassName='is-active'
          >
            HOME
          </div>
        </div>

        <div id="header-logo" onClick={this.scrollToTop}>
          <img src={desktopLogo} />
        </div>
        <div id="header-logo-mobile" onClick={this.scrollToTop}>
          <img src={mobileLogo} />
        </div>

      </div>
  )
}
