import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from "react-helmet";
import Mailchimp from 'components/Newsletter/Mailchimp.js'
import { Link } from 'react-router-dom'
import SocialLinks from 'components/SocialLinks/SocialLinks.js'

const diagTallImage = '/static/images/blue-logo-image-grid.png';
const gridPicImage = '/static/images/collage-full.png'
const colorFullImage = '/static/images/connectColors.png'
const color1Image = '/static/images/connectColors.png'

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
            <title>Rock With This</title>
          </Helmet>
             <div className="connectPage">
               <SocialLinks />


                <div className="main-content">
                <img className="color bottomMiddle" src={color1Image} />

                  <div className="middle-content">
                    <img className="gridPic" src={gridPicImage} />
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

                    </div>

                  </div>


                  <img className="color2" src={colorFullImage} />

                </div>

                <div className="blue-content">
                <img className="diagblue"src={diagTallImage} />


                <div className="blue-content-container">

                <h1 className="blue-title">We<b>{" don't"}</b> have<br className="mobile-br"/> every song...<br/>
                Just the best<br className="mobile-br"/> you {" haven't"} heard.
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
