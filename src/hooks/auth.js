import {useState, useEffect} from "react";
import UserService from '@/service/UserService'
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import store from '@/store'
import {setupWeb3} from '../util/auth'

export function useAuth () {
  const userService = new UserService()
  const history = useHistory()
  const dispatch = useDispatch()
  const wallet = useSelector(state => state.user.wallet)
  const merchantAction = store.getRedux('user').actions;

  useEffect(() => {
    async function verifyToken() {
      let data = await userService.verifyToken()
      if (data) {
        dispatch(merchantAction.username_update(data.user.username))
        dispatch(merchantAction.merchantStatus_update(data.user.merchantStatus))
        dispatch(merchantAction.downloadLink_update(data.downloadLink))
      }
      if (!data || (data && wallet && wallet.toLowerCase() !==data.user.wallet_address.toLowerCase())) {
        localStorage.removeItem('jwt')
        history.push('/login')
      }
    }
    verifyToken()
  }, [wallet])

  useEffect(() => {
    setupWeb3()
  }, [])
}
