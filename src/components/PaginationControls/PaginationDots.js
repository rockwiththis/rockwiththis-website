import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  currPageIndex: PropTypes.number.isRequired,
}

class PaginationDots extends React.Component {

  render() {

    const paginationDotsBase = [...Array(4)].map((z,i) => {
        const className = i == this.props.currPageIndex ?
          'pagination-dot pagination-dot-active' :
          'pagination-dot';
        return <button className={className}><i className="fas fa-circle"></i></button>;
    });

    const paginationDots = this.props.currPageIndex > 3 ?
      [
        <button className='pagination-dot-small'/>,
        ...paginationDotsBase,
        <button className='pagination-dot-small'/>,
      ] :
      [
        <button className='pagination-dot-small'/>,
        ...paginationDotsBase,
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
