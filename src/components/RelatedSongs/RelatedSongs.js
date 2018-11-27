import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as Scroll from 'react-scroll';

import './RelatedSongs.scss'

class RelatedSongs extends Component {


  

    renderRelatedSong(song, index) {
        return (
            <div className="songContainer" key={index}>
                <Link className="songImageLink" to={`/songs/${song.id}`}>
                    <img alt="songImage" className="songImage" src={song.image_url} />
                </Link>
            </div>
        )
    }

    relatedSongsStack () {
      const relatedSongs = this.props.relatedSongs.slice(0,10).map(this.renderRelatedSong)

      return (
        <div className="stack">{relatedSongs}</div>
      )
    }


    render() {
      // const relatedSongs = this.props.relatedSongs
      // const relatedSongs = this.props.relatedSongs.map(this.renderRelatedSong)

      // const relatedSongs = this.props.relatedSongs.map(this.renderRelatedSong)
      // const tagName = this.props.relatedSongs
      return (
            <div className="relatedSongs">
              <div className="relatedSongsContainer">
              <p className="related-songs-title">Related Tracks</p>
              {this.relatedSongsStack()}
            </div>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => ({
    relatedSongs: state.relatedSongs,
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RelatedSongs)
