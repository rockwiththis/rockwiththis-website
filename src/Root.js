import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Routes from './Routes'
import AppContainer from './AppContainer'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie';

class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
          <BrowserRouter>
              <AppContainer>
                   <CookiesProvider>
                      <Routes />
                  </CookiesProvider>
              </AppContainer>
          </BrowserRouter>
      </Provider>
    )
  }
}

export default Root
