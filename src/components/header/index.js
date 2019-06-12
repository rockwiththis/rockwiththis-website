import React, { Component } from 'react'
import Link from 'next/link';
import { HOME } from 'constants/page-names';

import HomepageHeader from './homepage';
import AwayHeader from './away';

export default class Header extends Component {

  headerContents = () => {
    switch(this.props.pageName) {
      case HOME:
        <HomepageHeader />;
        break;
      default:
        <AwayHeader />;
    }
    
  }

  render = () => (
      <div id="header">

        { this.headerContents() }

        <div className="nav-right">
          <Link href="/connect">
            <span clasName="nav-link nav-about">About</span>
          </Link>
        </div>

      </div>
  );
}
