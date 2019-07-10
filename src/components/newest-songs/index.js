import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import NewSongGridSong from 'components/song-grid/playable';
import Placeholder from './placeholder';

class NewestSongs extends React.Component {

  static propTypes = {
    newestSongPosts: PropTypes.array.isRequired,
    songPlayStatusForSong: PropTypes.func.isRequired,
    songPlayerFunctionsForSong: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.mainDivRef = React.createRef();
  }

  getClientHeight = () => this.mainDivRef.current.clientHeight;

  render = () => (
      <div className="newest-songs" ref={this.mainDivRef} >
        {this.props.newestSongPosts.length > 0 ?
          this.props.newestSongPosts.map((songData, i) => (
              <NewSongGridSong
                key={songData.id}
                songData={songData}
                songPlayStatus={this.props.songPlayStatusForSong(songData)}
                songPlayerFunctions={this.props.songPlayerFunctionsForSong(songData)}
                isFeaturedSong={i === 0}
              />
          ))
          :
          <Placeholder />
        }
        
        <style jsx global>{`
          .newest-songs .playable-grid-song {
            height: 20vw;
            width: 20vw;
            max-width: calc(1658px * 0.2);
            max-height: calc(1658px * 0.2);
          }
          .newest-songs .playable-grid-song.featured-song {
            height: 40vw;
            width: 40vw;
            max-width: calc(1658px * 0.4);
            max-height: calc(1658px * 0.4);
            float: left;
          }
          @media (max-width: 1200px) {
            .newest-songs .playable-grid-song:nth-last-child(1) {
              display: none;
            }
            .newest-songs .playable-grid-song:nth-last-child(2) {
              display: none;
            }
            .newest-songs .playable-grid-song {
              height: 25vw;
              width: 25vw;
            }
            .newest-songs .playable-grid-song.featured-song {
              height: 50vw;
              width: 50vw;
            }
          }
          @media (max-width: 800px) {
            .newest-songs {
              position: relative;
              width: 100vw;
              height: 100vw;
            }
            .newest-songs .playable-grid-song {
              height: 33.3vw;
              width: 33.3vw;
              position: absolute;
            }
            .newest-songs .playable-grid-song.featured-song {
              height: 66.6vw;
              width: 66.6vw;
              top: 0;
              left: 0;
            }
            .newest-songs .playable-grid-song:nth-child(2) {
              bottom: 0;
              left: 0;
            }
            .newest-songs .playable-grid-song:nth-child(3) {
              bottom: 0;
              left: 33.3%;
            }
            .newest-songs .playable-grid-song:nth-child(4) {
              bottom: 0;
              right: 0;
              height: 33.4vw;
              width: 33.4vw;
            }
            .newest-songs .playable-grid-song:nth-child(5) {
              bottom: 33.3%;
              right: 0;
              height: 33.4vw;
              width: 33.4vw;
            }
            .newest-songs .playable-grid-song:nth-child(6) {
              display: inline-block;
              top: 0;
              right: 0;
              height: 33.4vw;
              width: 33.4vw;
            }
          }
          @media (max-width: 480px) {
            .newest-songs .playable-grid-song {
              display: none;
            }
            .newest-songs .playable-grid-song:nth-child(6) {
              display: none;
            }
            .newest-songs .playable-grid-song.featured-song {
              display: inline-block;
              width: 100vw;
              height: 100vw;
            }
          }
        `}</style>
      </div>
  );
}

export default NewestSongs;
