import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { didAutoplayFail } from 'actions/set-state';
import { IoIosClose as CloseIcon } from 'react-icons/io';

import { errorShape } from 'constants/prop-shapes';
import { resolveError } from 'actions/set-state';

const INTERACTION_EVENT_TYPES = ['touchstart', 'mousedown', 'keydown'];

class ErrorModal extends Component {

  static propTypes = {
    ignoreShowOnce: PropTypes.bool,

    // redux
    error: PropTypes.exact(errorShape),
    resolveError: PropTypes.func.isRequired
  }

  componentDidUpdate = prevProps => {
    if (!prevProps.didAutoplayFail && this.props.didAutoplayFail) {
      INTERACTION_EVENT_TYPES.map(eventType =>
        window.addEventListener(eventType, this.props.resolveError)
      );
    } else if (prevProps.didAutoplayFail && !this.props.didAutoplayFail) {
      INTERACTION_EVENT_TYPES.map(eventType =>
        window.removeEventListener(eventType, this.props.resolveError)
      )
    }
  }

  shouldDisplay = () => {
    if (!this.props.error) return false;

    if (this.props.error.showOnce && !this.props.ignoreShowOnce) {
      const hideToUser = (
        window.localStorage &&
        window.localStorage.getItem(this.props.error.typeKey)
      );
      window.localStorage.setItem(this.props.error.typeKey, '1');

      return !hideToUser
    }

    return true;
  }

  render = () => (
      this.shouldDisplay() ?
        <div className="error-modal">
          <div className="modal-background"></div>

          <div className="modal-content">
            <div className="modal-close"><CloseIcon /></div>

            { this.props.error.messsageLines.map((text, i) =>
                <p key={i}>{ text }</p>
            )}
          </div>

          <style jsx>{`
            .error-modal {
              position: fixed;
              width: 100%;
              height: 100%;
              z-index: 3000;
            }
            .modal-background {
              position: fixed;
              width: 100%;
              height: 100%;
              background-color: grey;
              opacity: 0.6;
            }
            .modal-content {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              height: 350px;
              background: linear-gradient(to right, #1e0c49, #0097d5);
              border: 2px solid white;
              box-sizing: border-box;
              color: white;
              font-size: 20pt;
              overflow: scroll;
            }
            .modal-close {
              font-size: 42px;
              margin-bottom: 10px;
            }
            .modal-content p {
              font-size: 42px;
              margin-bottom: 10px;
            }
            @media (max-width: 800px) {
              .modal-content {
                wdith: 80%;
                font-size: 16pt;
              }
            }
          `}</style>
        </div>
        :
        null
  );
}

export default connect(
  ({ error }) => ({ error }),
  { resolveError }
)(ErrorModal);
