import React, { Component } from 'react';
import Link from 'next/link';

import AwayNavigation from './away-navigation.js'

const desktopLogo = '/static/images/RWT-Hortizontal-Logo-Vector.svg'
const mobileLogo = '/static/images/RWT_HeadLogo.svg'

export default class AwayHeader extends Component {

  render = () => (
      <div id="away-header">

        <div className="nav-left">
          <AwayNavigation />
        </div>

        <Link to="/">
          <img className="header-logo" src={desktopLogo} />
        </Link>
        <Link to="/">
          <img className="header-logo-mobile" src={mobileLogo} />
        </Link>

      </div>
  );
}
