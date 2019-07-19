import React from 'react'

const LoadingSpinner = () => (
    <div className="loading-spinner">
      { Array(5).fill().map(_ => (
          <div className="rect"></div>
      ))}

      <style jsx>{`
        .loading-spinner {
          height: 60px;
          width: 100%;
          text-align: center;
        }
        .rect {
          display: inline-block;
          height: 100%;
          width: 6px;
          margin: 0 5px;
          background-color: #333;
          animation: loading-rect-stretchdelay 1.2s infinite ease-in-out;
        }
        .rect:nth-child(2) {
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        .rect:nth-child(3) {
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        .rect:nth-child(4) {
          -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
        }

        .rect:nth-child(5) {
          -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s;
        }
        @-webkit-keyframes loading-rect-stretchdelay {
          0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
          20% { -webkit-transform: scaleY(1.0) }
        }
        @keyframes loading-rect-stretchdelay {
          0%, 40%, 100% {
            transform: scaleY(0.4);
           -webkit-transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1.0);
            -webkit-transform: scaleY(1.0);
          }
        }
      `}</style>
    </div>
)

export default LoadingSpinner
