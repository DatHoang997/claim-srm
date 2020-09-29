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
          const props = _.omit(item, ['page', 'path', 'type'])
          const R = item.type || PrivateRoute
          return (
            <R path={item.path} auth={item.auth} key={i} exact component={item.page} {...props} />
          )
        })}
      </Switch>
      {
        !window.ethereum &&
        <Redirect to='/login' />
      }
    </div>
  )
}

function PrivateRoute({ children, auth, path, ...rest }) {
  const checkAuth = () => {
    var islogin = localStorage.getItem('jwt')
    if (islogin && (path === '/login' || path === '/register/:refId?')) return <Redirect to={"/"}/>

    if (islogin) {
      return children
    } else {
      if (path === '/login' || path === '/register/:refId?') {
        return children
      } else {
        return <Redirect to={"/login"}/>
      }
    }
  }

  return (
    <Route
      {...rest}
    >
      {checkAuth()}
    </Route>
  );
}

loginEzdefi()
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

if (sessionStorage.getItem('api-token')) {
  getUserProfile(render)
} else {
  render()
}
