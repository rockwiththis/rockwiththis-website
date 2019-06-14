import React, { Component } from 'react'
import Link from 'next/link';
import { animateScroll } from 'react-scroll';
import { HOME } from 'constants/page-names';

import HomepageLeftNav from './homepage-left-nav';
import AwayLeftNav from './away-left-nav';

const desktopLogo = '/static/images/RWT-Hortizontal-Logo-Vector.svg'
const mobileLogo = '/static/images/RWT_HeadLogo.svg'

export default class Header extends Component {

  leftNavContents = () => {
    if (this.props.pageName === HOME) {
      return <HomepageLeftNav />
    } else {
      return <AwayLeftNav />
    }
  }

  handleLogoClick = () => {
    if (this.props.pageName === HOME)
      animateScroll.scrollTo(0);
  } 

  render = () => (
      <div className="header">

        <div className="nav-left">
          { this.leftNavContents() }
        </div>

        <div className="header-logo desktop-only" onClick={this.handleLogoClick}>
          <img src={desktopLogo} />
        </div>
        <div className="header-logo-mobile mobile-only" onClick={this.handleLogoClick}>
          <img src={mobileLogo} />
        </div>

        <div className="nav-right">
          <Link href="/connect">
            <span className="nav-link nav-about">About</span>
          </Link>
        </div>

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
        <style jsx>{`
          .header {
            height: 75px;
            background: linear-gradient(to right, #1e0c49, #0097d5);
          }
          .nav-left {
            width: 400px;
            position: absolute;
            top: 30px;
            left: 35px;
          }
          .nav-right {
            width: 100px;
            position: absolute;
            top: 30px;
            right: 35px;
          }
          .header-logo {
            width: 400px;
            margin: 0 auto;
            padding-top: 15px;
          }
          .header-logo-mobile {
            margin: auto 10px;
          }
        `}</style>
      </div>
  );
}
