import BaseService from '../model/BaseService'
import axios from 'axios'
import BigNumber from 'big-number'
import Web3 from "web3";
import {NetIds} from "../constant";
import AsrmContract from '../../build/production/contracts/POC_Token.json'
import {thousands, weiToPOC, hideAddress,
  hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'

let API_URL = process.env.SERVER_URL
const API = {
  CLAIM_SRM : 'http://192.168.1.88:3030/api' + '/user/',
  SWAP_SRM : 'http://192.168.1.88:3030/api' + '/user/swap/',
  // CLAIM_SRM : API_URL + '/user/',
  // SWAP_SRM : API_URL + '/user/swap/',
  GET_USER : API_URL + '/user/get_user/'
}

export default class extends BaseService {
  async claimASRM(fb_id) {
    let that = this
    const storeUser = this.store.getState().claimASRM
    const web3 = new Web3(window.ethereum)
    const claimASRMRedux = this.store.getRedux('claimASRM')
    let wallet = storeUser.wallet
    if ((web3.currentProvider.networkVersion && web3.currentProvider.networkVersion != NetIds.production) ||
    (web3.currentProvider.net_version && web3.currentProvider.net_version() && web3.currentProvider.net_version() != NetIds.production)
    ) {
      return false
    }
    console.log('wallet', wallet)
    let message = fb_id + '.' + wallet + '.' + 'ezdefi'
    web3.eth.personal.sign(message, wallet).then(async (signature) => {
      try {
        let response = await axios.post(API.CLAIM_SRM, {
          message: message,
          signature: signature,
        })
        console.log('response',response)
        that.dispatch(claimASRMRedux.actions.serverResponse_update(response.data))
      } catch (error) {
        console.log('err', error)
        that.dispatch(claimASRMRedux.actions.serverResponse_update(error))
      }
    })
    .catch(err => {
      that.dispatch(claimASRMRedux.actions.signatureResponse_update(err))
    });
  }
// 6VTiGtHw67jJxnftBMbmnE5g8jsGJhYfXm55csfWmS5W
  async swapSRM(amount, address, wallet) {
    console.log('wallet',wallet)
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimASRMRedux = this.store.getRedux('claimASRM')
    let message = wallet + '.' + address + '.' + 'ezdefi'
    let contract = new web3.eth.Contract(AsrmContract.abi, process.env.ASRM_CONTRACT_ADDRESS)
    console.log(contract)
    let balance = await contract.methods.balanceOf(wallet).call({ from: wallet })
    console.log(balance)
    web3.eth.personal.sign(message, wallet).then(async (signature) => {
      contract.methods.transfer(process.env.ASRM_POOL, pocToWei(amount))
      .send({
        from: wallet
      })
      .then(async (transfer) => {
        console.log('txHast', transfer)
        try {
          let response = await axios.post(API.SWAP_SRM, {
            txHash: transfer.transactionHash,
            message: message,
            signature: signature,
          })
          var data = response.data
          console.log('@#@#@#response', data)
          this.asrmBalance()
          that.dispatch(claimASRMRedux.actions.serverResponse_update(data))
          return false;
        } catch (error) {
          console.log('err', error)
          that.dispatch(claimASRMRedux.actions.serverResponse_update(error))
        }
      }).catch(err => {
        that.dispatch(exchangeRedux.actions.serverResponse_update(err))
      })
    })
    .catch(err => {
      that.dispatch(claimASRMRedux.actions.signatureResponse_update(err))
    });
  }

  async response(ps_id) {
    console.log(ps_id)
    let URL = "https://api.botbanhang.vn/v1.3/public/json?access_token=f366d3eaeacba4f0c7a23ca752d9d615100905085ab2fb180b70afc4c3f6d9da&psid=" + ps_id
    console.log(URL)
    try {
      let response = await axios.post(URL, {"redirect_to_blocks": ["5f7c3245d5fa6c00120a7c9d"]})
      return response;
    } catch (error) {
      console.log('err', error)
    }
  }

  async getUerData(fb_id) {
    try {
      let response = await axios.get(API.GET_USER + fb_id)
      return response;
    } catch (error) {
      console.log('err', error)
    }
  }

  async asrmBalance() {
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimASRMRedux = this.store.getRedux('claimASRM')
    let contract = new web3.eth.Contract(AsrmContract.abi, process.env.ASRM_CONTRACT_ADDRESS)
    await window.web3.eth.getAccounts(async (err, accounts) => {
      if (err) return err
      let balance = await contract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
      console.log(balance)
      that.dispatch(claimASRMRedux.actions.balance_update(weiToPOC(balance)))
    })
  }
}
