import BaseService              from '../model/BaseService'
import axios                    from 'axios'
import BigNumber                from 'big-number'
import {thousands}              from '@/util/help.js'


let API_URL = process.env.SERVER_URL
const API = {
  PUT_POC_STATS   : API_URL + '/pocstats/',
  GET_HISTORY     : API_URL + '/pocstats/history/',
  DELETE_STATS    : API_URL + '/pocstats/delete/',
  VND_POC_PRICE   : API_URL + '/getprice/poc/vnd/',
  USD_POC_PRICE   : API_URL + '/getprice/poc/usd/',
  SET_ROLE        : API_URL + '/auth/set-role/'
}

let foundation
export default class extends BaseService {
  async pocStats(pocBalance, dead , amount = '', price = '', txHash = '') {
    var that = this
    const pocStatsRedux = this.store.getRedux('pocStats')
    let formData = new FormData();
    if (amount != '') {
      formData.append("amount", amount);
    }
    if (price != '') {
      formData.append("price", price);
    }
    if (txHash != '') {
      formData.append("txHash", txHash);
    }
    formData.append("pocBalance", pocBalance);
    formData.append("dead", dead);
    try {
      let response = await axios.put(API.PUT_POC_STATS, formData,
        {
          headers: {"Content-Type": "multipart/form-data"}
        }
      )
      var data = response.data.data
      if (data.sold != 0) {
        if (foundation == BigNumber('2000000000000000000000000').subtract(data.sold).toString()) {
          data.error = ''
        }
        else {
          data.error = 'Sold balance is not matched'
        }
      }
      that.dispatch(pocStatsRedux.actions.pocStats_update(data))
      that.history()
      return false;
    } catch (error) {
      return error.response.data;
    }
  }

  async history () {
    const that = this
    const pocStatsRedux = this.store.getRedux('pocStats')
    that.dispatch(pocStatsRedux.actions.history_update(''))
    axios.get(API.GET_HISTORY)
      .then(function (response) {
        var data = response.data.data
        that.dispatch(pocStatsRedux.actions.history_update(data))
      })
  }

  async deleteStats (statsId, pocBalance, dead) {
    let that = this
    if (statsId) {
      await axios.delete(API.DELETE_STATS + statsId)
      .then(function (response) {
        that.pocStats(pocBalance, dead)
        that.history()
        that.PocPriceVND()
        that.PocPriceUSD()
        return false;
      })
    } else {
      return "Error"
    }
  }

  async PocPriceVND () {
    let that = this
    const pocStatsRedux = this.store.getRedux('pocStats')
    axios.get(API.VND_POC_PRICE)
      .then(function (response) {
        var data = response.data.data.price
        if (data != 0) {
          let dot = data.indexOf('.')
          let dataLength = data.slice(0, dot).length
          let float = parseFloat(data).toPrecision(dataLength+2).toString()
          that.dispatch(pocStatsRedux.actions.pocPriceVND_update(thousands(float, 2)))
        } else {
          that.dispatch(pocStatsRedux.actions.pocPriceVND_update('0'))
        }
      })
  }

  async PocPriceUSD () {
    let that = this
    const pocStatsRedux = this.store.getRedux('pocStats')
    axios.get(API.USD_POC_PRICE)
      .then(function (response) {
        var data = response.data.data.price
        if (data != 0) {
          let dot = data.indexOf('.')
          let dataLength = data.slice(0, dot).length
          let float = parseFloat(data).toPrecision(dataLength+2).toString()
          that.dispatch(pocStatsRedux.actions.pocPriceUSD_update(thousands(float, 2)))
        } else {
          that.dispatch(pocStatsRedux.actions.pocPriceUSD_update('0'))
        }
      })
  }

  async setRole(role, wallet) {
    let formData = new FormData();
    formData.append("role", role);
    formData.append("wallet", wallet);
    try {
      let response = await axios.post(API.SET_ROLE, formData,
        {
          headers: {"Content-Type": "multipart/form-data"}
        }
      )
      console.log(response)
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
}
