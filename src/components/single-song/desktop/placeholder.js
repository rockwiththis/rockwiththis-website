import React from 'react';

const SingleSongDesktopPlaceholder = () => (
    <div className="single-song-desktop-placeholder">

      <div className="image pulse"></div>

      <div className="post">
        <div className="header">
          <div className="play-button pulse"></div>
          <div className="title">
            <div className="song-name pulse"></div>
            <div className="artist-name pulse"></div>
          </div>
        </div>
            
        <div className="post-content">
          { Array(18).fill().map((_,i) => (
            <div className="text-line pulse" key={i}></div>
          ))}
        </div>
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
        .single-song-desktop-placeholder {
          max-width: 1365px;
          margin: 0 auto;
        }
        .image {
          display: inline-block;
          width: 45%;
          height: 0;
          padding-bottom: 45%;
          margin-right: 40px;
        }
        .post {
          display: inline-block;
          vertical-align: top;
          width: calc(55% - 40px);
          height: 615px;
          overflow: hidden;
        }
        .header {
          width: 100%;
          margin-bottom: 25px;
        }
        .play-button {
          display: inline-block;
          width: 60px;
          height: 60px;
          margin-right: 20px;
          border-radius: 50%;
        }
        .title {
          display: inline-block;
          vertical-align: top;
          width: calc(100% - 80px);
        }
        .song-name {
          height: 30px;
          width: 80%;
          margin-bottom: 15px;
        }
        .artist-name {
          height: 15px;
          width: 70%;
        }
        .text-line {
          height: 15px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
);

export default SingleSongDesktopPlaceholder;
