import React, { Component } from 'react'
import Link from 'next/link';

export default class AwayNavigation extends Component {

  render = () => (
      <Link href="/">
        <div className="nav-link">
          <svg
            className="home-back-button"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M13 7v-6l11 11-11 11v-6h-13v-10z" />
          </svg>            
        </div>
      </Link>
  );
}
