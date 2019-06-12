import React from 'react';
import Head from 'next/head';

class HomepageHeaders extends React.Component {

  render = () => (
      <Head>
        <title>Rock With This</title>
          <meta name="description" content="We don't have every song...just the best you haven't heard." />
          <meta name="keywords" content="Music Discovery Curation" />
          <meta name="application-name" content="ROCKWITHTHIS" />
          <meta name="theme-color" content="#e162f8" />
          <meta property="og:url" content="http://www.rockwiththis.com/" />
          <meta property="og:title" content="Rock With This" />
          <meta property="og:description" content="We don't have every song. Just the best you haven't heard." />
          <meta property="og:image" content="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-1/p200x200/49844120_667342663682594_5822783533663387648_n.jpg?_nc_cat=104&_nc_ht=scontent-sjc3-1.xx&oh=e0a0be17100a25cf00020b625ecb52cc&oe=5CC6B728" />
          <meta property="og:image:url" content="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-1/p200x200/49844120_667342663682594_5822783533663387648_n.jpg?_nc_cat=104&_nc_ht=scontent-sjc3-1.xx&oh=e0a0be17100a25cf00020b625ecb52cc&oe=5CC6B728" />
      </Head>
  )
}

export default HomepageHeaders;
