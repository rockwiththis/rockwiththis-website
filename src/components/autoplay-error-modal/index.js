import React from 'react';
import { connect } from 'react-redux';
import { didAutoplayFail } from 'actions/set-state';
import { IoIosClose as CloseIcon } from 'react-icons/io';

import './autoplay-error-modal.scss';

const INTERACTION_EVENT_TYPES = ['touchstart', 'mousedown', 'keydown'];
const HAS_SHOWN_MODAL_STORAGE_NAME = 'HAS_SHOWN_AUTOPLAY_MODAL';

class AutoplayErrorModal extends React.Component {


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

  shouldDisplay = () => {
    if (this.props.showModalOverride && this.props.didAutoplayFail) return true;
    if (!this.props.didAutoplayFail) return false;
    if (!window.localStorage) return true;
    if (!!window.localStorage.getItem(HAS_SHOWN_MODAL_STORAGE_NAME)) return false;

    window.localStorage.setItem(HAS_SHOWN_MODAL_STORAGE_NAME, '1');
    return true;
  }

  autoplayFailureResolved = () => this.props.setDidAutoplayFail(false);

  render = () => (
      <div className={`autoplay-error-modal ${!this.shouldDisplay() ? 'hidden' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="modal-close"><CloseIcon /></div>
          <p>Your browser does not support autoplay, but we can still cue up the next song for you.</p>
          <p>To continue playing music, just hit play below.</p>
        </div>
      </div>
  );
}

export default connect(
  ({ didAutoplayFail }) => ({ didAutoplayFail }),
  { setDidAutoplayFail: didAutoplayFail }
)(AutoplayErrorModal);
