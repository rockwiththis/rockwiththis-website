import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Homepage from 'pages/homepage';
import ConnectPage from 'pages/ConnectPage';
import SingleSongPage from 'pages/SingleSongPage';
import CoachellaPage from 'pages/Coachella/CoachellaPage';

const Routes = props => {
  return (
      <Switch>
        <Route
          exact path='/'
          render={() => <Homepage {...props} />}
        />
        <Route
          exact path='/autoplay-modal'
          render={() => <Homepage {...{ ...props, showAutoplayModal: true }} />}
        />
        <Route
          exact path='/coachella'
          render={() => <CoachellaPage {...props} />}
        />
        <Route
          exact path='/connect'
          render={() => <ConnectPage {...props} />}
        />
        <Route
          path='/songs/:id'
          render={(p) => <SingleSongPage {...props} {...p} />}
        />
      </Switch>
  )
}

export default Routes
