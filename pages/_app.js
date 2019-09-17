import React from 'react';
import App, { Container } from 'next/app';
import dynamic from 'next/dynamic';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import configureStore from 'store/configureStore';

import HeadContent from './head-content/app';
import FooterAudioPlayer from 'components/footer-audio-player';
import ErrorModal from 'components/error-modal';

import './fonts.scss'

// Importing the soundcloud widget throws a `window is not defined` error
// when rendered server side
const AudioManager = dynamic(
  () => import('components/audio-manager'),
  { ssr: false }
);

class MyApp extends App {

  constructor(props) {
    super(props);
    this.state = {
      isScrollDisabled: false
    }
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = !!Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  setIsScrollDisabled = isScrollDisabled =>
    this.setState({ isScrollDisabled })

  updateSongProgress = manualProgressRatio => {
    this.setState({ manualProgressRatio });
  }

  render = () => {
    const { Component, pageProps, store } = this.props;
    const componentProps = {
      ...pageProps,
      setIsScrollDisabled: this.setIsScrollDisabled
    };

    return (
        <Container>
          <Provider store={store}>
            <HeadContent />
            <Component {...componentProps} />

            <ErrorModal />
            <FooterAudioPlayer
              updateSongProgress={this.updateSongProgress}
            />
            <AudioManager
              manualProgressRatio={this.state.manualProgressRatio}
            />
          </Provider>

          <style global jsx>{`
            body {
              font-family: 'Object-Sans-Regular', sans-serif;
              margin: 0;
              padding: 0;
              border: 0;
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
