import BaseService from '../model/BaseService'
import axios from 'axios'
import BigNumber from 'big-number'
import {thousands} from '@/util/help.js'
import Web3 from "web3";
import {NetIds}    from "../constant";

let API_URL = process.env.SERVER_URL
const API = {
  CLAIM_SRM : 'http://192.168.1.88:3030/api' + '/user/',
  // CLAIM_SRM : API_URL + '/claim-srm/',
  SWAP_SRM : API_URL + '/claim-srm/swap/',
}

export default class extends BaseService {
  async claimZSRM(fb_id, ps) {
    let wallet
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimZSRMRedux = this.store.getRedux('claimZSRM')

    if ((web3.currentProvider.networkVersion && web3.currentProvider.networkVersion != NetIds.production) ||
    (web3.currentProvider.net_version && web3.currentProvider.net_version() && web3.currentProvider.net_version() != NetIds.production)
    ) {
      return false
    }
    await window.web3.eth.getAccounts(async (err, accounts) => {
      wallet = accounts[0]
      console.log('wallet', wallet)
      let message = fb_id + '.' + wallet + '.' + 'ezdefi'
      web3.eth.personal.sign(message, wallet).then(async (signature) => {
        try {
          let response = await axios.post(API.CLAIM_SRM, {
            data: message,
            signature: signature,
          })
          console.log('response',response)
          that.dispatch(claimZSRMRedux.actions.serverResponse_update(response.data))
        } catch (error) {
          console.log('err', error)
          that.dispatch(claimZSRMRedux.actions.serverResponse_update(error))
        }
      })
      .catch(err => {
        that.dispatch(claimZSRMRedux.actions.signatureResponse_update(err))
      });
    })
  }

  async swapSRM(address) {
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimZSRMRedux = this.store.getRedux('claimZSRM')
    let message = '.' + address + '.' + 'ezdefi'
    await window.web3.eth.getAccounts(async (err, accounts) => {
      if (err) return
      if (accounts.length > 0) {
        //transfer ZSRM to Pool then, send srm back to address
        web3.eth.personal.sign(message, accounts[0]).then(async (signature) => {
          try {
            let response = await axios.post(API.SWAP_SRM, {
              data: message,
              signature: signature,
            })
            var data = response.data
            console.log(data)
            that.dispatch(claimZSRMRedux.actions.serverResponse_update(data))
            return false;
          } catch (error) {
            console.log('err', error)
            that.dispatch(claimZSRMRedux.actions.serverResponse_update(error))
          }
        })
        .catch(err => {
          that.dispatch(claimZSRMRedux.actions.signatureResponse_update(err))
        });
      } else {
        that.dispatch(claimZSRMRedux.actions.signatureResponse_update(false))
      }
    })
  }

  async response(ps_id) {
    console.log(ps_id)
    let URL = "https://api.botbanhang.vn/v1.3/public/json?access_token=f366d3eaeacba4f0c7a23ca752d9d615100905085ab2fb180b70afc4c3f6d9da&psid=" + ps_id
    console.log(URL)
    try {
      let response = await axios.post(URL, {
        Header: {"Content-Type": "application/json"},
        Body: {"redirect_to_blocks": ["5f7c3245d5fa6c00120a7c9d"]}
      })
      console.log('response@@@@@@@', response)
      return response;
    } catch (error) {
      console.log('err', error)
    }

  }
}
