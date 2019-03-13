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
                  <svg className="singleSongBackButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13 7v-6l11 11-11 11v-6h-13v-10z"/></svg>            
              </NavLink>
            </div>

          }


          </div>
        )
    }
}


export default NavLeftNotHome
