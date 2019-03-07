import React, { Component } from 'react'
import { Link, NavLink, Nav } from 'react-router-dom'
/* eslint-disable */

class NavLeftNotHome extends Component {

    render() {
        return (
          <div>

          {   location.pathname == "/connect" ?

            <div className="nav-left">
              <NavLink className="nav-link" to="/" activeClassName='none'>HOME</NavLink>
            </div>

            :

            <div className="nav-left">
              <NavLink className="nav-link" to="/" activeClassName='none'>
                  <svg className="singleSongBackButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 12l-12-8v5h-12v6h12v5z"/></svg>              </NavLink>
            </div>

          }


          </div>
        )
    }
}


export default NavLeftNotHome
