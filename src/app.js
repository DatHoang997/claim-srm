import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import {Route, Switch, useHistory, Redirect} from 'react-router-dom'
import { Provider } from 'react-redux'
import { Router } from "react-router";
import store from '@/store'
import config from '@/config'
import Helmet from 'react-helmet'

import {getUserProfile, loginEzdefi} from './util/auth'
import axios from './util/axios'
import './boot'
import './style/index.scss'

console.warn = () => {}

const middleware = (render, props) => {
  return render
}

const App = () => {
  return (
    <div>
      <Helmet>
      </Helmet>
      <Switch id="ss-main">
        {_.map(config.router, (item, i) => {
          console.log('item', item)
          const props = _.omit(item, ['page', 'path', 'type'])
          console.log('props', props)
          // const R = PrivateRoute
          // console.log('R',R)
          return (
            // <R path={item.path} auth={item.auth} key={i} exact component={item.page} {...props} />
            // <h1>alolo</h1>
            <Route
            path={item.path} auth={item.auth} key={i} exact component={item.page} {...props}
          >
            {/* {checkAuth()} */}
          </Route>
          )
        })}
      </Switch>
    </div>
  )
}

function PrivateRoute({ children, auth, path, ...rest }) {
  return (
    <Route
      {...rest}
    >
      {/* {checkAuth()} */}
    </Route>
  );
}

// loginEzdefi()
const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router middleware={middleware} history={store.history}>
        <App />
      </Router>
    </Provider>,
    document.getElementById('ss-root')
  )
}

render()

