import React from 'react';

const SingleSongMobilePlaceholder = () => (
    <div className="single-song-mobile-placeholder">
      
      <div className="song-image pulse">

        <div className="song-title-wrapper">
          <div className="song-player-control pulse"></div>

          <div className="song-info">
            <div className="song-name pulse"></div>
            <div className="artist-name pulse"></div>
          </div>
        </div>

      </div>

      <div className="single-song-post-content">
        { Array(18).fill().map((_,i) => (
          <div className="text-line pulse" key={i}></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { background: rgba(165, 165, 165, .1); }
          50% { background: rgba(165, 165, 165, .4); }
          100% { background: rgba(165, 165, 165, .1); }
        }
        .pulse {
          animation: pulse 1s infinite ease-in-out;
        }
        .song-image {
          width: 100vw;
          height: 100vw;
          margin: 0 auto;
          position: relative;
        }
        .post-info {
          background: white;
        }
        .song-player-control {
          border-radius: 50%;
          margin-right: 20px;
        }
        .song-info {
          display: inline-block;
          vertical-align: top;
          width: calc(100% - 80px);
        }
        .song-name {
          width: 80%;
          height: 15px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .artist-name {
          width: 70%;
          height: 12px;
        }
        .single-song-post-content {
          margin-top: 10px;
        }
        .text-line {
          height: 15px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
);

export default SingleSongMobilePlaceholder;

