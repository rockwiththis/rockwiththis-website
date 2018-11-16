import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet";
import Mailchimp from 'components/Newsletter/Mailchimp.js'
import { Link } from 'react-router-dom'

import SongsContainer from 'SongsContainer.js'
import { fetchPosts } from 'actions/index'
import { fetchFilters } from 'actions/filters'

import introImage from 'images/intro-bigger.png'
import diag2 from 'images/diagblue.png'
import diagTall from 'images/blue-logo-image-grid.png'
import logo1 from 'images/connect-logo.svg'
import logo2 from 'images/connect-logo.svg'
import gridPic from 'images/collage-full.png'
import line from 'images/gradient-line.png'
import tickets from 'images/tickets.svg'
import songs from 'images/songs.svg'
import pic1 from 'images/pic1.png'
import pic2 from 'images/pic2.png'
import pic3 from 'images/pic3.png'
import colorFull from 'images/connectColors.png'
import color1 from 'images/connectColors.png'
import colorIntroLong from 'images/connectColorsIntroLong.png'
import cross from 'images/cross.svg'
import logoWriting from 'images/logo-writing-black.png'
import instagram from 'images/instagram-square.jpg'
import facebook from 'images/facebook-square.jpg'
import twitter from 'images/twitter-square.jpg'
import soundcloud from 'images/soundcloud-square.jpg'
import spotify from 'images/spotify.png'


class ConnectPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {

      const url = "https://rockwiththis.us17.list-manage.com/subscribe/post?u=bfac2b1c3906a8dba6db52ab1&amp;id=ddc17b51d2";

      const songGrid = this.props.filteredPosts.slice(0,16).map((song, index) => {
        return (
            <div className="songContainer" key={index}>
                <Link className="songImageLink" to={`/songs/${song.id}`}>
                    <img alt="songImage" className="songImage" src={song.better_featured_image && song.better_featured_image.source_url} />
                </Link>
            </div>
        )
      })

        return (
          <div>
          <Helmet>
            <title>Rock With This - Your New Favorite Song</title>
          </Helmet>
             <div className="connectPage">


                <div className="main-content">
                <img className="color bottomMiddle" src={color1} />

                  <div className="middle-content">
                    <img className="gridPic" src={gridPic} />
                    <div className="four-content">
                        <h3>
                          HUMAN RHYTHMS. <br/>
                          NOT ALGORITHMS. <br/>
                        </h3>

                      <p className="mission-tagline">
                      <b>{"Rock With This'"} mission is simple, to help you discover your new favorite songs.</b>
                      </p>
                      <hr />

                      <p className="email-text">Join us for daily songs, fresh playlists, and free tix to sold out shows!</p>

                      <Mailchimp
                          action='https://rockwiththis.us17.list-manage.com/subscribe/post?u=bfac2b1c3906a8dba6db52ab1&amp;id=ddc17b51d2'
                          fields={[
                            {
                              name: 'EMAIL',
                              placeholder: 'Email',
                              type: 'email',
                              required: true
                            }
                          ]}

                          className='rwt-email-form'
                        />
                        <div className="social-container">
                          <ul>
                          <li><a target="_blank" href="https://www.instagram.com/rockwiththismusic/"><img src={instagram} /></a></li>
                          <li><a target="_blank" href="https://www.facebook.com/rockwiththis/"><img src={facebook} /></a></li>
                          <li><a target="_blank" href="https://www.twitter/RWTmusic"><img src={twitter} /></a></li>
                          <li><a target="_blank" href="https://www.twitter/RWTmusic"><img src={soundcloud} /></a></li>
                          <li><a target="_blank" href="https://www.twitter/RWTmusic"><img src={spotify} /></a></li>
                          </ul>
                        </div>

                    </div>

                  </div>


                  <img className="color2" src={colorFull} />

                </div>

                <div className="blue-content">
                <img className="diagblue"src={diagTall} />


                <div className="blue-content-container">

                <h1 className="blue-title">{"We don't have every song."}<br/>
                {"Just the best you haven't heard"}.
                </h1>
                <p>{"Our team consists of huge music lovers who spend hours each day digging through tracks, to deliver the best of what's breaking and uncover the left behind tracks that need to be heard."} </p>
                </div>

                </div>

              </div>

           </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => Object.assign(state, ownProps)

export default connect(mapStateToProps)(ConnectPage)
