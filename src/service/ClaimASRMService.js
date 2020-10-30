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
  // CLAIM_SRM : 'http://192.168.1.88:3030/api' + '/user/',
  // SWAP_SRM : 'http://192.168.1.88:3030/api' + '/user/swap/',
  // POST_INFO : 'http://192.168.1.88:3030/api' + '/user/info/',
  // GET_INFO : 'http://192.168.1.88:3030/api' + '/user/get_info/',
  // GET_WALLET : 'http://192.168.1.88:3030/api' + '/user/get_wallet/',
  CLAIM_SRM : API_URL + '/user/',
  SWAP_SRM : API_URL + '/user/swap/',
  GET_USER : API_URL + '/user/get_user/',
  POST_INFO : API_URL + '/user/info/',
  GET_WALLET : API_URL + '/user/get_wallet/',
  GET_INFO : API_URL + '/user/get_info/',
}

export default class extends BaseService {
  async claimASRM(fb_id) {
    let that = this
    const storeUser = this.store.getState().claimASRM
    const claimASRMRedux = this.store.getRedux('claimASRM')
    const web3 = storeUser.web3
    let wallet = storeUser.wallet
    if ((web3.currentProvider.networkVersion && web3.currentProvider.networkVersion != NetIds.production) ||
    (web3.currentProvider.net_version && web3.currentProvider.net_version() && web3.currentProvider.net_version() != NetIds.production)
    ) {
      console.log('checkkkkkkkkkkkk')
      return false
    }

    try {
      var message = fb_id + '.' + wallet + '.' + 'ezdefi'
      var signature = await web3.eth.personal.sign(message, wallet)
    } catch (error) {
      console.log('signature')
      return false
    }

    try {
      let response = await axios.post(API.CLAIM_SRM, {
        message: message,
        signature: signature,
      })
      that.dispatch(claimASRMRedux.actions.serverResponse_update(response.data))
    } catch (error) {
      that.dispatch(claimASRMRedux.actions.serverResponse_update(error))
    }

  }
// 6VTiGtHw67jJxnftBMbmnE5g8jsGJhYfXm55csfWmS5W
  async swapSRM(amount, address, wallet) {
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimASRMRedux = this.store.getRedux('claimASRM')
    let message = wallet + '.' + address + '.' + 'ezdefi'
    let contract = new web3.eth.Contract(AsrmContract.abi, process.env.ASRM_CONTRACT_ADDRESS)
    let balance = await contract.methods.balanceOf(wallet).call({ from: wallet })
    web3.eth.personal.sign(message, wallet).then(async (signature) => {
      contract.methods.transfer(process.env.ASRM_POOL, pocToWei(amount))
      .send({
        from: wallet
      })
      .then(async (transfer) => {
        try {
          let response = await axios.post(API.SWAP_SRM, {
            txHash: transfer.transactionHash,
            message: message,
            signature: signature,
          })
          var data = response.data
          this.asrmBalance()
          that.dispatch(claimASRMRedux.actions.serverResponse_update(data))
          return false;
        } catch (error) {
          that.dispatch(claimASRMRedux.actions.serverResponse_update(error))
        }
      }).catch(err => {
        that.dispatch(claimASRMRedux.actions.signatureResponse_update(err))
      })
    })
    .catch(err => {
      that.dispatch(claimASRMRedux.actions.signatureResponse_update(err))
    });
  }

  async response(ps_id) {
    let URL = "https://api.botbanhang.vn/v1.3/public/json?access_token=f366d3eaeacba4f0c7a23ca752d9d615100905085ab2fb180b70afc4c3f6d9da&psid=" + ps_id
    try {
      let response = await axios.post(URL, {"redirect_to_blocks": ["5f7c3245d5fa6c00120a7c9d"]})
      return response;
    } catch (error) {
      return error
    }
  }

  async getUerData(fb_id) {
    try {
      let response = await axios.get(API.GET_USER + fb_id)
      return response;
    } catch (error) {
      return error
    }
  }

  getUser(fb_id) {
    return axios.get(API.GET_USER + fb_id)
  }

  async asrmBalance() {
    let that = this
    const web3 = new Web3(window.ethereum)
    const claimASRMRedux = this.store.getRedux('claimASRM')
    let contract = new web3.eth.Contract(AsrmContract.abi, process.env.ASRM_CONTRACT_ADDRESS)
    await window.web3.eth.getAccounts(async (err, accounts) => {
      if (err) return err
      let balance = await contract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
      that.dispatch(claimASRMRedux.actions.balance_update(weiToPOC(balance)))
    })
  }

  async insertInformation(name, address, phoneNumber, reward, wallet) {
    let that = this
    const claimASRMRedux = this.store.getRedux('claimASRM')
    let formData = new FormData()
    formData.append("name", name)
    formData.append("address", address)
    formData.append("phoneNumber", phoneNumber)
    formData.append("viettel", reward)
    formData.append("wallet", wallet)
    try {
      let response = await axios.post(API.POST_INFO, formData)
      console.log(response)
      that.dispatch(claimASRMRedux.actions.formResponse_update(response))
      return response.data;
    } catch (error) {
      return error
    }
  }

  async getInfo(wallet) {
    try {
      let response = await axios.get(API.GET_INFO + wallet)
      console.log('response', response.data.message)
      if (response.data.message == 'Success') {
        return response.data;
      }
      if (response.data.message == 'false') {
        return response.data;
      }
    } catch (error) {
      return error
    }
  }

  async getWallet(wallet) {
    let that = this
    const claimASRMRedux = this.store.getRedux('claimASRM')
    try {
      let response = await axios.get(API.GET_WALLET + wallet)
      if (response.data.data) {
        that.dispatch(claimASRMRedux.actions.dbWallet_update(response.data.data))
      }
      return response;
    } catch (error) {
      return error
    }
  }
}
