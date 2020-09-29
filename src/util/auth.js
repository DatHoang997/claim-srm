import store from '@/store'

import {USER_ROLE} from '@/constant'
import {api_request} from './'
import {CONTRACTS} from '@/constant'
import Web3 from "web3";


// export const setupWeb3 = async (callback = null) => {
//   const userRedux      = store.getRedux('user')
//   let isRequest        = false
//   let isLoggedIn       = false

//   await window.web3.eth.getAccounts(async (err, accounts) => {
//     if (err) return
//     if (accounts.length > 0) {
//       // detect account switch
//       if (!isLoggedIn) {
//         const web3 = new Web3(window.ethereum)
//         store.dispatch(userRedux.actions.web3_update(web3))
//         store.dispatch(userRedux.actions.wallet_update(accounts[0]))
//         if (callback) await callback()
//       }
//     } else {
//       if (!isRequest) {
//         isRequest = true
//         await window.ethereum.enable()
//       }
//       store.dispatch(userRedux.actions.loginMetamask_update(false))
//     }
//   })
// }


// export const loginEzdefi = (callback) => {
//   const userRedux      = store.getRedux('user')
//   const contractsRedux = store.getRedux('contracts')
//   const web3           = new Web3(window.ethereum)

//   const contracts = {
//     // ReadWrite: new web3.eth.Contract(CONTRACTS.ReadWrite.abi, CONTRACTS.ReadWrite.address),
//     ReadWrite: new web3.eth.Contract(CONTRACTS.ReadWrite.abi, CONTRACTS.ReadWrite.address, {gasPrice: '0'}),
//     PocToken: new web3.eth.Contract(CONTRACTS.PocToken.abi, CONTRACTS.PocToken.address, {gasPrice: '0'}),
//     PocPool: new web3.eth.Contract(CONTRACTS.PocPool.abi, CONTRACTS.PocPool.address, {gasPrice: '0'}),
//     Citizen: new web3.eth.Contract(CONTRACTS.Citizen.abi, CONTRACTS.Citizen.address, {gasPrice: '0'})
//   }
//   //
//   store.dispatch(userRedux.actions.loginMetamask_update(true))
//   store.dispatch(contractsRedux.actions.readWrite_update(contracts.ReadWrite))
//   store.dispatch(contractsRedux.actions.pocToken_update(contracts.PocToken))
//   store.dispatch(contractsRedux.actions.pocPool_update(contracts.PocPool))
//   store.dispatch(contractsRedux.actions.citizen_update(contracts.Citizen))
//   store.dispatch(userRedux.actions.web3_update(web3))

//   // store.dispatch(userRedux.actions.loginMetamask_update(false))
// }

// export const getUserProfile = (callback) => {
//   const userRedux = store.getRedux('user')
//   api_request({
//     path   : '/user/current_user',
//     success: data => {
//       store.dispatch(userRedux.actions.is_login_update(true))
//       if ([USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(data.role)) {
//         store.dispatch(userRedux.actions.is_admin_update(true))
//       }
//       store.dispatch(userRedux.actions.profile_update(data.profile))
//       store.dispatch(userRedux.actions.role_update(data.role))

//       callback()
//     }
//   })
// }
