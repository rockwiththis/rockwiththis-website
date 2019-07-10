import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

export default class SingleSongHeadContent extends Component {

  static propTypes = {
    songData: PropTypes.object.isRequired
  }

  render = () => (
      <Head>
        <title>Rock With This - {this.props.songData.name} by {this.props.songData.artist_name}</title>
        <meta name="song" content={this.props.songData.name} />
        <meta name="artist" content={this.props.songData.artist_name} />
        <meta name="description" content={this.props.songData.description} />
        <meta name="og:image" content={this.props.songData.image_url} />
        <meta property="og:image:width"  content="300" />
        <meta property="og:image:height" content="300" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        { this.props.songData.sub_genres.map((genre, i) =>
            <meta name="tag" content={genre.name} key={i} />
        )}
      </Head>
  )
}
