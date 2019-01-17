import React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'
import configureStore from './store/configureStore'
import './stylesheets/index.css'
import ReactGA from 'react-ga';

const store = configureStore();

if (process.env.NODE_ENV === 'development') {
  window.store = store
}

function initializeReactGA() {
    ReactGA.initialize('UA-132692108-1');
    ReactGA.pageview('/homepage');
}

// TODO we should really split up the stores by route
ReactDOM.render((
    <Root store={store} />
), document.getElementById('root'),
)
