import React, { Component } from 'react'
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
          <div>
          <Helmet>
            <title>Rock With This - Your New Favorite Song</title>
          </Helmet>
             <div className="homeContainer">
                 <HeroPosts
                   {...this.props}
                   heroPosts={this.props.heroPosts}
                 />
               <DiscoverSection {...this.props} />
                 </div>
           </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => Object.assign(state, ownProps)

export default connect(mapStateToProps)(Homepage)
