import React from 'react';
import App, { Container } from 'next/app';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import configureStore from 'store/configureStore'

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    const pageProps = !!Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render = () => {
    const { Component, pageProps, store } = this.props;

    return (
        <Container>
          <Provider store={store}>
            <Component {...pageProps} />

            {/*
            <FooterAudioPlayer
              onProgressUpdate={this.handleProgressUpdate}
              playNextSong={this.playNextSong()}
              previousSong={this.findPreviousSong()}
              {...this.props}
            />
            {
              !!this.props.activeSong && !!this.props.activeSong.id &&
              <AudioManager
                setSongDuration={this.props.actions.playerLoaded}
                setActiveSongProgress={this.props.actions.setSongProgress}
                playSong={this.props.playSong}
                onSongEnd={this.playNextSong(true)}
                ref={this.audioManagerRef}
              />
            }
            */}
          </Provider>
        </Container>
    );
  }
}

export default withRedux(configureStore)(MyApp);
