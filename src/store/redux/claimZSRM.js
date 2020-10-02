import BaseRedux from '@/model/BaseRedux'

class claimZSRMRedux extends BaseRedux {
  defineTypes () {
    return ['claimZSRM']
  }

  defineDefaultState () {
    return {
      serverResponse: '',
      signatureResponse: ''
    }
  }
}

export default new claimZSRMRedux()
