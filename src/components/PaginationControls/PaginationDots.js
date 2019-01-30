import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  currPageIndex: PropTypes.number.isRequired,
}

class PaginationDots extends React.Component {

  renderRegularDot = (isActive = false) => {
    const className = isActive ?
      'pagination-dot pagination-dot-active' :
      'pagination-dot';
    return <button className={className}><i className="fas fa-circle"></i></button>;
  }

  render() {

    const paginationDots =
      this.props.currPageIndex > 3 ?
        [
          <button className='pagination-dot-small'/>,
          ...([...Array(3)].map(() => this.renderRegularDot())),
          this.renderRegularDot(true),
          <button className='pagination-dot-small'/>,
        ] :
        [
          ...([...Array(4)].map((z,i) => this.renderRegularDot(i === this.props.currPageIndex))),
          <button className='pagination-dot-small'/>,
        ];

    return (
        <div className="pagination-container">
          { paginationDots }
        </div>
    );
  }
}

PaginationDots.propTypes = propTypes;

export default PaginationDots;
