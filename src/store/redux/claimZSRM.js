import BaseRedux from '@/model/BaseRedux'

class claimZSRMRedux extends BaseRedux {
  defineTypes () {
    return ['claimZSRM']
  }

  defineDefaultState () {
    return {
      serverResponse: '',
      signatureResponse: '',
      fb_id: '',
      ps_id: '',
      wallet: '',
      web3: '',
    }
  }
}

export default new claimZSRMRedux()
