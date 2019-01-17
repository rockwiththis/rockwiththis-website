import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga';
import Root from './Root'
import { Helmet } from 'react-helmet';
import configureStore from './store/configureStore'
import './stylesheets/index.css'

const store = configureStore();

if (process.env.NODE_ENV === 'development') {
  window.store = store
}

function initializeReactGA() {
    ReactGA.initialize('UA-132667269-1');
    ReactGA.pageview('/homepage');
}







// TODO we should really split up the stores by route
ReactDOM.render((
    <Root store={store} />
), document.getElementById('root'),
)
