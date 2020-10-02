import BaseService from '../model/BaseService'
import axios from 'axios'
import BigNumber from 'big-number'
import {thousands} from '@/util/help.js'
import Web3 from "web3";

let API_URL = process.env.SERVER_URL
const API = {
  CLAIM_SRM   : API_URL + '/claim-srm/',
}

export default class extends BaseService {
  async claimZSRM(fb, address) {
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimZSRMRedux = this.store.getRedux('claimZSRM')
    let message = '.' + address + '.' + 'ezdefi'
    await window.web3.eth.getAccounts(async (err, accounts) => {
      if (err) return
      if (accounts.length > 0) {
        web3.eth.personal.sign(message, accounts[0]).then(async (signature) => {
          try {
            let response = await axios.post(API.CLAIM_SRM, {
              data: message,
              signature: signature,
            })
            var data = response.data
            console.log(response)
            that.dispatch(claimZSRMRedux.actions.serverResponse_update(data))
            that.history()
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
}
