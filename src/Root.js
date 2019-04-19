import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Routes from './Routes';
import AppContainer from './AppContainer';
import TestControls from 'components/audio-manager/test-controls';

class Root extends Component {
  render() {
    return (
        <Provider store={this.props.store}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/test/' component={TestControls} />
              <Route render = {() => (
                <AppContainer>
                  <Routes />
                </AppContainer>
              )} />
            </Switch>
          </BrowserRouter>
        </Provider>
    )
  }
}

export default Root
