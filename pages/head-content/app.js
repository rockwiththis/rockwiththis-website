import React, { Component } from 'react';
import Head from 'next/head';

export default class AppHeadContent extends Component {

  render = () => (
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
      </Head>
  )
}

