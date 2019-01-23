import React, { Component } from 'react'
import './SocialLinks.scss'
/* eslint-disable */

class SocialLinks extends Component {

    render() {
        return (
          <div className={`socialLinks ${location.pathname !== "/" ? 'notFixed' : ''}`}>
            <ul>
            <li><a target="_blank" href="http://bit.ly/SPRockWithThis"><i className="im im-spotify"></i></a></li>
            <li className="sc"><a target="_blank" href="http://bit.ly/SCRockWithThis"><i className="im im-soundcloud"></i></a></li>
            <li className="insta"><a target="_blank" href="http://bit.ly/IGRockWithThis"><i className="im im-instagram"></i></a></li>
            <li className="fb"><a target="_blank" href="https://www.facebook.com/rockwiththis/"><i className="im im-facebook"></i></a></li>
            <li className="twitter"><a target="_blank" href="https://www.twitter.com/RWTMusic/"><i className="im im-twitter"></i></a></li>

            </ul>
          </div>
        )
    }
}


export default SocialLinks
