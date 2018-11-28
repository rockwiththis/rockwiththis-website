import React, { Component } from 'react'
import { Link, NavLink, Nav } from 'react-router-dom'
// import * as Scroll from 'react-scroll'
import {  Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import desktopLogo from 'images/logo-desktop.png'
import mobileLogo from 'images/logo-mobile.png'
import NavLeftNotHome from './NavLeftNotHome.js'

import './Header.scss'

/* eslint-disable */

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
          thisWeek: true,
        }

        this.scrollToDiscover = this.scrollToDiscover.bind(this)
        this.scrollToTop = this.scrollToTop.bind(this)
        this.checkDiscoverOrThisWeek = this.checkDiscoverOrThisWeek.bind(this)
        this.scrollToDiscover = this.scrollToDiscover.bind(this)
    }

    componentDidMount() {
      console.log("location.pathname")
      console.log(location.pathname)
      if (location.pathname === "/") {
        window.addEventListener('scroll', this.checkDiscoverOrThisWeek)
        window.addEventListener('resize', this.checkDiscoverOrThisWeek)
      }
      if (location.pathname !== "/") {
        window.removeEventListener('scroll', this.checkDiscoverOrThisWeek)
        window.removeEventListener('resize', this.checkDiscoverOrThisWeek)
      }
    }


    checkDiscoverOrThisWeek() {

      if (location.pathname == "/") {
        const scrollHeight = document.getElementById('hero-post').clientHeight + 45
        const thisWeek = window.scrollY < scrollHeight
        this.setState({ thisWeek })
      }

    }

    scrollToDiscover() {
      const scrollHeight = document.getElementById('hero-post').clientHeight + 45

        scroll.scrollTo(scrollHeight)
    }

    scrollToTop() {
      this.setState({ thisWeek: true })

        scroll.scrollTo(0)
  }

    render() {

        return (
            <div className={`headerContainer shrunk ${location.pathname == "/submit" ? 'submit' : ''}`}>
              <div className="content-wrapper">
                  {   location.pathname == "/" ?
                  <div className="nav-left">
                  <Link className={`nav-link nav-week ${this.state.thisWeek ? 'active' : ''}`} onClick={this.scrollToTop} to="/" >This Week</Link>

                    <Link className={`nav-link nav-discover ${!this.state.thisWeek ? 'active' : ''}`} onClick={this.scrollToDiscover} to="/" >Discover</Link>
                    <NavLink className="nav-link nav-submit" to="/" activeClassName='is-active' >HOME</NavLink>

                  </div>

                    :

                    <NavLeftNotHome />

                    }

              {   location.pathname == "/" ?

              <Link id="headerLogo" onClick={this.scrollToTop}  to="/">
                <img src={desktopLogo} />
              </Link>
                :
                <Link id="headerLogo" to="/">
                  <img src={desktopLogo} />
                </Link>


              }
              {   location.pathname == "/" ?

              <Link id="headerLogoMobile" onClick={this.scrollToTop} to="/">
                <img src={mobileLogo} />
              </Link>
                :
                <Link id="headerLogoMobile" to="/">
                  <img src={mobileLogo} />
                </Link>


              }
              <div className="nav-right">
                {/* <NavLink className="nav-link nav-submit" to="/submit" activeClassName='is-active' >Submit</NavLink>*/}
                <NavLink className="nav-link nav-about" to="/connect" activeClassName='is-active' >About</NavLink>
              </div>
              </div>
            </div>
        )
    }
}

export default Header
