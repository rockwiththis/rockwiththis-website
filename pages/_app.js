import React from 'react';
import App, { Container } from 'next/app';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import configureStore from 'store/configureStore'

class MyApp extends App {

  constructor(props) {
    super(props);
    this.state = { isScrollDisabled: false }
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = !!Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  setIsScrollDisabled = isScrollDisabled =>
    this.setState({ isScrollDisabled })

  render = () => {
    const { Component, pageProps, store } = this.props;
    const componentProps = {
      ...pageProps,
      setIsScrollDisabled: this.setIsScrollDisabled
    };

    return (
        <Container>
          <Provider store={store}>
            <Component {...componentProps} />

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
          <style global jsx>{`
            body {
              font-family: 'Object-Sans-Bold', sans-serif;
              margin: 0;
              overflow: scroll;
              scrollbar-width: none;
              -ms-overflow-style: none;
              overflow: ${this.state.isScrollDisabled ? 'hidden' : 'auto'};
              min-width: 320px;
            }
            body::-webkit-scrollbar {
              width: 0px;
            }
            @media (min-width: 800px) {
              .mobile-only {
                display: none;
              }
            }
            @media (max-width: 800px) {
              .desktop-only {
                display: none;
              }
            }
          `}</style>
        </Container>
    );
  }
}

export default withRedux(configureStore)(MyApp);
