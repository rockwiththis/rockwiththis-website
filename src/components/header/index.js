import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from 'next/link';
import { animateScroll } from 'react-scroll';
import { HOME, SONG, ALL_PAGE_NAMES } from 'constants/page-names';

import HomepageLeftNav from './left-nav/homepage';
import SongLeftNav from './left-nav/song';
import AwayLeftNav from './left-nav/away';

const desktopLogo = '/static/images/RWT-Hortizontal-Logo-Vector.svg'
const mobileLogo = '/static/images/RWT_HeadLogo.svg'

export default class Header extends Component {

  static propTypes = {
    pageName: PropTypes.oneOf(ALL_PAGE_NAMES).isRequired,
    scroll: PropTypes.object.isRequired
  }

  leftNavContents = () => {
    if (this.props.pageName === HOME) {
      return <HomepageLeftNav scroll={this.props.scroll} />
    } else if (this.props.pageName === SONG) {
      return <SongLeftNav />
    } else  {
      return <AwayLeftNav />
    }
  }

  handleLogoClick = () => {
    if (this.props.pageName === HOME) animateScroll.scrollTo(0);
  }

  render = () => (
      <div className="header">

        <div className="nav-left">
          { this.leftNavContents() }
        </div>

        <div className="header-logo" onClick={this.handleLogoClick}>
          <img src={desktopLogo} />
        </div>
        <div className="header-logo-mobile" onClick={this.handleLogoClick}>
          <img src={mobileLogo} />
        </div>

        <div className="nav-right">
          <Link href="/connect">
            <span className="nav-link nav-about">About</span>
          </Link>
        </div>

        <style jsx>{`
          .header {
            position: fixed;
            top: 0
            left: 0;
            right: 0;
            width: 100%;
            height: 75px;
            background: linear-gradient(to right, #1e0c49, #0097d5);
            z-index: 20;
          }
          .nav-left {
            position: absolute;
            top: 25px;
            left: 35px;
            cursor: pointer;
          }
          .nav-right {
            position: absolute;
            top: 25px;
            right: 35px;
            margin-top: 5px;
            cursor: pointer;
          }
          .header-logo {
            width: 400px;
            margin: 0 auto;
            padding-top: 15px;
            cursor: pointer;
          }
          .header-logo-mobile {
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .header-logo-mobile img {
            width: 55px;
          }
          @media (min-width: 800px) {
            .header-logo-mobile {
              display: none;
            }
          }
          @media (max-width: 800px) {
            .header-logo {
              display: none;
            }
          }
        `}</style>
        <style global jsx>{`
          .nav-link {
            text-transform: uppercase;
            font-size: 10pt;
            margin: 0 10px;
            color: rgba(255, 255, 255, 0.7);
          }
          .nav-link.active {
            border-bottom: 1px solid #fff;
            color: white;
          }
          .nav-left div {
            float: left;
          }
        `}</style>
      </div>
  );
}
