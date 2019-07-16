import React, { Fragment } from 'react';

const FullViewDesktopPlaceholder = () => (
    <Fragment>

      <div className="song-grid-container">
        { Array(30).fill().map((_, i) => (
            <div className="song-grid-song pulse"></div>
        ))}
      </div>

      <div className="song-post">

        <div className="image pulse"></div>

        <div className="header">
          <div className="play-button pulse"></div>
          <div className="title">
            <div className="song-name pulse"></div>
            <div className="artist-name pulse"></div>
          </div>
        </div>

        <div className="post-content">
          { Array(18).fill().map((_,i) => (
            <div className={'text-line pulse' + (i < 6 ? ' wrap-image' : '')}></div>
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
        .song-grid-container {
          height: 605px;
          overflow: hidden;
        }
        .song-grid-song {
          width: 25%;
          height: 0;
          padding-bottom: 25%;
          display: inline-block;
          border: 1px solid white;
          box-sizing: border-box;
        }
        .image {
          width: 240px;
          height: 240px;
          float: left;
          margin-right: 20px;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
        .header {
          width: calc(100% - 260px);
          margin-left: 260px;
          margin-bottom: 25px;
        }
        .play-button {
          display: inline-block;
          width: 50px;
          height: 50px;
          margin-right: 20px;
          border-radius: 50%;
        }
        .title {
          display: inline-block;
          vertical-align: top;
          width: calc(100% - 70px);
        }
        .song-name {
          height: 20px;
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
        .text-line.wrap-image {
          width: calc(100% - 260px);
          margin-left: 260px;
        }
      `}</style>
    </Fragment>
);

export default FullViewDesktopPlaceholder;
