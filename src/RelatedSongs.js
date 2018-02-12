import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class RelatedSongs extends Component {

    renderRelatedSong(song, index) {
        return (
            <div className="songContainer" key={index}>
                <img alt="songImage" className="songImage" src={song.better_featured_image.source_url} />
                <div className="songInfo">
                    <span className="songName">{song.acf.song_name}</span> <br />
                    <span className="artistName">{song.acf.artist_name}</span>
                </div>
            </div>
        )
    }


    render() {
      const relatedSongs = this.props.relatedSongs.map(this.renderRelatedSong)
      return (
            <div className="relatedSongs">
              {relatedSongs}
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
