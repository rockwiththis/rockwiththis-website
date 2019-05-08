import React from 'react';
import { connect } from 'react-redux';
import { didAutoplayFail } from 'actions/set-state';

import './autoplay-error-modal.scss';

const INTERACTION_EVENT_TYPES = ['touchstart', 'mousedown', 'keydown'];

class AutoplayErrorModal extends React.Component {

  componentDidRender = () =>
      INTERACTION_EVENT_TYPES.map(eventType =>
        window.addEventListener(eventType, this.autoplayFailureResolved)
      );

  componentDidUpdate = prevProps => {
    if (!prevProps.didAutoplayFail && this.props.didAutoplayFail) {
      INTERACTION_EVENT_TYPES.map(eventType =>
        window.addEventListener(eventType, this.autoplayFailureResolved)
      );
    } else if (prevProps.didAutoplayFail && !this.props.didAutoplayFail) {
      INTERACTION_EVENT_TYPES.map(eventType =>
        window.removeEventListener(eventType, this.autoplayFailureResolved)
      )
    }
  }

  autoplayFailureResolved = () => this.props.setDidAutoplayFail(false);

  render = () => (
      <div className={`autoplay-error-modal ${!this.props.didAutoplayFail ? 'hidden' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <p>Your browser does not support autoplay. Touch anywhere to play the next song</p>
          <p>This message will not be shown again</p>
        </div>
      </div>
  );
}

export default connect(
  ({ didAutoplayFail }) => ({ didAutoplayFail }),
  { setDidAutoplayFail: didAutoplayFail }
)(AutoplayErrorModal);
