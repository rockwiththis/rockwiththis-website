import React, { Component } from 'react';
import {
  FaSpotify,
  FaSoundcloud,
  FaInstagram,
  FaFacebook,
  FaTwitter
} from 'react-icons/fa';

export default class SocialLinks extends Component {

  render = () => (
      <div className="social-links">
        <a href="http://bit.ly/SPRockWithThis"><FaSpotify /></a>
        <a href="http://bit.ly/SCRockWithThis"><FaSoundcloud /></a>
        <a href="http://bit.ly/IGRockWithThis"><FaInstagram /></a>
        <a href="https://www.facebook.com/rockwiththis/"><FaFacebook /></a>
        <a href="https://www.twitter.com/RWTMusic/"><FaTwitter /></a>

        <style jsx>{`
          .social-links {
            width: 100%;
            height: 40px;
            text-align: center;
            font-size: 18pt;
            background-color: #f5f3f3;
          }
          a {
            display: inline-block;
            padding: 8px 20px;
            color: black;
          }
        `}</style>
      </div>
  );
}
