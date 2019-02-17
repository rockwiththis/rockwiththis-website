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
      const filteredRelatedSongs = this.props.relatedSongs.filter(relatedSong => relatedSong.id !== this.props.singleSong.id)
      const relatedSongs = filteredRelatedSongs.slice(0,11).map(this.renderRelatedSong)


      return (
        <div className="stack">{relatedSongs}</div>
      )
    }


    render() {

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
