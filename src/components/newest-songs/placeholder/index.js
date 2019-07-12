import React from 'react'

const NewestSongsPlaceholder = () => (
    <div className="newest-songs-placeholder">
      { Array(7).fill.map((_,i) => (
          <div className={'song-tile ' + (i === 0 ? ' featured-song ' : '')}>

            <div className="post-info">
              <div className="play-container"></div>
                <div className="play-button"></div>
              </div>
              <div className="song-info">
                <div className="song-name"></div>
                <div className="artist-name"></div>
              </div>
              <div className="date-box"></div>
            </div>

          </div>
      ))}

      <style jsx>{`
        .newest-songs-placeholder div {
          animation: pulse 1s infinite ease-in-out;
        }
        .post-info {
          position: absolute;
          bottom: 0;
          width: 100%;
          transition: all 0s linear;
          height: 100px;
        }
        .play-container {
          display: inline-block;
          width: 100px;
          height: 100px;
        }
        .play-button {
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75px;
          height: 75px;
        }
        .song-info {
          display: inline-block;
          width: calc(100% - 200px);
          height: 100%
        }
        .song-name {
          width: 55%;
          height: 25px;
          margin: 15px;
        }
        .artist-name {
          width: 45%;
          height: 25px;
          margin: 15px;
        }
        .date-box {
          display: inline-block;
          width: 100px;
          height: 100%;
        }
      `}</style>
    </div>
);

export default NewestSongsPlaceholder;
