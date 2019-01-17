import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet';
import HeroPosts from 'components/HeroGrid/HeroPosts'
import DiscoverSection from 'components/DiscoverSection/DiscoverSection.js'
import { fetchPosts } from 'actions/index'
import { fetchFilters } from 'actions/filters'

class Homepage extends Component {
    componentWillMount() {
      this.props.actions.clearSingleSong()
      if (this.props.filteredPosts.length === 0) {
        this.props.actions.fetchPosts()
      }
    }

    render() {
        return (
          <Fragment>
              <Helmet>
                <title>Rock With This</title>
                  <meta name="description" content="We don't have every song. Just the best you haven't heard." />
                  <meta name="keywords" content="Music Discovery Curation" />
                  <meta name="application-name" content="ROCKWITHTHIS" />
                  <meta name="theme-color" content="#e162f8" />
                  <meta property="og:url" content="http://www.rockwiththis.com/" />
                  <meta property="og:title" content="Rock With This" />
                  <meta property="og:description" content="We don't have every song. Just the best you haven't heard." />

              </Helmet>
              <div>
                 <div className="homeContainer">
                     <HeroPosts
                       {...this.props}
                       heroPosts={this.props.heroPosts}
                     />
                   <DiscoverSection {...this.props} />
                     </div>
               </div>
           </Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => Object.assign(state, ownProps)

export default connect(mapStateToProps)(Homepage)
