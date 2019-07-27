import React from 'react'

const NewestSongsPlaceholder = () => (
    <div className="newest-songs-placeholder">
      { Array(7).fill().map((_,i) => (
          <div
            className={'song-tile pulse' + (i === 0 ? ' featured-song ' : '')}
            key={i}
          >

            <div className="post-info">
              <div className="play-container">
                <div className="play-button pulse"></div>
              </div>
              <div className="song-info">
                <div className="song-name pulse"></div>
                <div className="artist-name pulse"></div>
              </div>
              <div className="date-box pulse"></div>
            </div>

          </div>
      ))}

      <style jsx>{`
        @keyframes pulse {
          0% { background: rgba(165, 165, 165, .1); }
          50% { background: rgba(165, 165, 165, .4); }
          100% { background: rgba(165, 165, 165, .1); }
        }
        .pulse {
          animation: pulse 1s infinite ease-in-out;
        }
        .song-tile {
          display: inline-block;
          vertical-align: top;
          position: relative;
        }
        .post-info {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 50px;
          background: white;
        }
        .play-container {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 100%;
        }
        .play-button {
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75%;
          height: 75%;
        }
        .song-info {
          display: inline-block;
          width: calc(100% - 100px);
          height: 100%
        }
        .song-name {
          width: 55%;
          height: 25%;
          margin: 10px;
        }
        .artist-name {
          width: 45%;
          height: 25%;
          margin: 10px;
        }
        .date-box {
          display: inline-block;
          width: 50px;
          height: 100%;
        }
        .song-tile.featured-song .post-info {
          height: 100px;
        }
        .song-tile.featured-song .play-container {
          width: 100px;
        }
        .song-tile.featured-song .song-info {
          width: calc(100% - 200px);
        }
        .song-tile.featured-song .song-name, .song-tile.featured-song .artist-name {
          margin: 15px;
        }
        .song-tile.featured-song .date-box {
          width: 100px;
        }
        @media (max-width: 800px) {
          .song-tile {
            display: none !important;
          }
          .song-tile.featured-song {
            display: inline-block !important;
            width: 100vw;
            height: 100vw
          }
          .song-tile.featured-song .post-info {
            height: 70px;
          }
          .song-tile.featured-song .play-container {
            width: 70px;
          }
          .song-tile.featured-song .song-info {
            width: calc(100% - 140px);
          }
          .song-tile.featured-song .song-name, .song-tile.featured-song .artist-name {
            margin: 12px;
          }
          .song-tile.featured-song .date-box {
            width: 70px;
          }
        }
      `}</style>
    </div>
);

export default NewestSongsPlaceholder;
