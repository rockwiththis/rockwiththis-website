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
                <svg className="singleSongBackButton" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 5.829l6.171 6.171-6.171 6.171v-3.171h-13v-6h13v-3.171zm-2-4.829v6h-13v10h13v6l11-11-11-11z"/></svg>
              </NavLink>
            </div>

          }


          </div>
        )
    }
}


export default NavLeftNotHome