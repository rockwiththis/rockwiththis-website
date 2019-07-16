import React, { Component } from 'react'
import Link from 'next/link';

export default class AwayLeftNav extends Component {

  render = () => (
      <div className="away-left-nav">
        <Link href="/">
          <div className="nav-link">Home</div>
        </Link>

        <style jsx>{`
          .away-left-nav {
            margin-top: 5px
          }
        `}</style>
      </div>
  );
}
