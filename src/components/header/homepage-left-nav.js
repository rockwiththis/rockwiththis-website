import React, { Component } from 'react'
import { animateScroll } from 'react-scroll';

export default class HomepageLeftNav extends Component {

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
      <div className="homepage-left-nav">
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
      </div>
  )
}
