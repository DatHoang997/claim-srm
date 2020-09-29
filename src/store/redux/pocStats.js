import BaseRedux from '@/model/BaseRedux'

class pocStatsRedux extends BaseRedux {
  defineTypes () {
    return ['pocStats']
  }

  defineDefaultState () {
    return {
      pocStats: [],
      pocBalance: null,
      dead: null,
      history: [],
      pocPriceVND: null,
      pocPriceUSD: null,
    }
  }
}

export default new pocStatsRedux()
