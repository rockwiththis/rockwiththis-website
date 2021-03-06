import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import SongTile from 'components/song-tile';
import Placeholder from './placeholder';

import { songPlayerShape } from 'constants/prop-shapes';

class NewestSongs extends React.Component {

  static propTypes = {
    newestSongPosts: PropTypes.array.isRequired,
    songPlayers: PropTypes.objectOf(PropTypes.exact(songPlayerShape)).isRequired
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
              <SongTile
                key={songData.id}
                songData={songData}
                songPlayer={this.props.songPlayers[songData.id]}
                isFeaturedSong={i === 0}
              />
          ))
          :
          <Placeholder />
        }

        <style jsx global>{`
          .newest-songs .song-tile {
            height: 20vw;
            width: 20vw;
            max-width: calc(1658px * 0.2);
            max-height: calc(1658px * 0.2);
            border: 1px solid white;
            box-sizing: border-box;
          }
          .newest-songs .song-tile.featured-song {
            height: 40vw;
            width: 40vw;
            max-width: calc(1658px * 0.4);
            max-height: calc(1658px * 0.4);
            float: left;
          }
          .newest-songs .genre-tag {
            font-weight: bold;
          }
          .newest-songs .song-tile.featured-song .genre-tag {
            font-size: 30pt;
            line-height: 32pt;
          }
          @media (max-width: 1200px) {
            .newest-songs .song-tile:nth-last-child(1) {
              display: none;
            }
            .newest-songs .song-tile:nth-last-child(2) {
              display: none;
            }
            .newest-songs .song-tile {
              height: 25vw;
              width: 25vw;
            }
            .newest-songs .song-tile.featured-song {
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
            .newest-songs .song-tile {
              height: 33.3vw;
              width: 33.3vw;
              // TODO it would be super nice to specify that these styles override
              // so !important is not necessary
              position: absolute !important;
            }
            .newest-songs .song-tile.featured-song {
              height: 66.6vw;
              width: 66.6vw;
              top: 0;
              left: 0;
            }
            .newest-songs .song-tile:nth-child(2) {
              bottom: 0;
              left: 0;
            }
            .newest-songs .song-tile:nth-child(3) {
              bottom: 0;
              left: 33.3%;
            }
            .newest-songs .song-tile:nth-child(4) {
              bottom: 0;
              right: 0;
              height: 33.4vw;
              width: 33.4vw;
            }
            .newest-songs .song-tile:nth-child(5) {
              bottom: 33.3%;
              right: 0;
              height: 33.4vw;
              width: 33.4vw;
            }
            .newest-songs .song-tile:nth-child(6) {
              display: inline-block;
              top: 0;
              right: 0;
              height: 33.4vw;
              width: 33.4vw;
            }
          }
          @media (max-width: 480px) {
            .newest-songs .song-tile {
              display: none !important;
            }
            .newest-songs .song-tile:nth-child(6) {
              display: none !important;
            }
            .newest-songs .song-tile.featured-song {
              display: inline-block !important;
              width: 100vw;
              height: 100vw;
            }
          }
        `}</style>
      </div>
  );
}

export default NewestSongs;
