import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet';
import Mailchimp from 'react-mailchimp-form'
import { Link } from 'react-router-dom'
import './stylesheets/coachella.scss'


import hands1 from 'images/hands.svg'


class SubmitSongPage extends Component {
    constructor(props) {
        super(props)

    }

    render() {


        return (
          <div>
          <Helmet>
            <title>Rock With This - Coachella Giveaway</title>
          </Helmet>
          <div className="CoachellaPage page">
            <h1>Coachella Tickets Giveaway</h1>
            <p>Enter you email for a chance to win two free Coachella weekend 1 tickets courtesy of Rock With This!</p>
            <p className="disclaimer">*This giveaway is not sponsored, endorsed or administered by, or associated with Coachella.</p>

          <div className="email-container">
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

           </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => Object.assign(state, ownProps)

export default connect(mapStateToProps)(SubmitSongPage)
