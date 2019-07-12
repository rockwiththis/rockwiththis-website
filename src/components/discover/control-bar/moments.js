import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Moments extends Component {

  static propTypes = {
    isActive: PropTypes.bool.isRequired,
    activeView: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
  }

  componentDidUpdate = prevProps => {

    if (!prevProps.isActive && this.props.isActive)
      document.addEventListener('click', this.props.hide);

    else if (prevProps.isActive && !this.props.isActive)
      document.removeEventListener('click', this.props.hide);
  }

  render() {
    return (
        <div
          className={
            'moments-modal' +
            (this.props.isActive ? '' : ' hidden')
          }
        >
          <p className="text">A playlist for all the moments of your life.</p>
          <p className="coming-soon">Coming soon!</p>

          <style jsx>{`
            .moments-modal.hidden {
              display: none;
            }
            .moments-modal {
              position: absolute;
              z-index: 10;
              left: 320px;
              width: auto;
              padding: 15px;
              color: #fff;
              background: rgba(0, 0, 0, 0.9);
              border-bottom-right-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            .text {
              font-size: 9pt;
              margin-bottom: 10px;
            }
            .coming-soon {
              font-size: 10.5pt;
              font-weight: bold;
            }
            @media (max-width: 800px) {
              .moments-modal {
                width: 100%;
                left: 0;
                text-align: center;
                border-radius: 0;
              }
            }
          `}</style>
        </div>
    )
  }
}
