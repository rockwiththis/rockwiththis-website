import React from 'react';
import PropTypes from 'prop-types';
import PaginationDots from './PaginationDots';

const propTypes = {
  currPageIndex: PropTypes.number.isRequired,
  onForward: PropTypes.func.isRequired,
  onBackward: PropTypes.func.isRequired
}

// TODO replace hard-coded arrow image links

class PaginationControls extends React.Component {

  render() {
    return (
        <div className='pagination-controls'>

          <button className='grid-arrow previous' onClick={this.props.onBackward}>
            <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
          </button>

          <PaginationDots currPageIndex={this.props.currPageIndex} />

          <button className='grid-arrow next' onClick={this.props.onForward}>
            <img src='https://s3-us-west-1.amazonaws.com/rockwiththis/arrow.png' />
          </button>
        </div>
    )
  }
}

PaginationControls.propTypes = propTypes;

export default PaginationControls;
