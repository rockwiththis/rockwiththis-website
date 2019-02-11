import React, { Component } from 'react'

export default class FullViewIcon extends Component {

  render() {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={this.props.width}
          height={this.props.height}
          viewBox="0 0 24 24"
        >
          <path d="M6 6h-6v-6h6v6zm18-6h-16v24h16v-24zm-18 9h-6v6h6v-6zm0 9h-6v6h6v-6z"/>
        </svg>
    )
  }
}
