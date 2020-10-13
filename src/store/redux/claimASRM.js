import BaseRedux from '@/model/BaseRedux'

class claimASRMRedux extends BaseRedux {
  defineTypes () {
    return ['claimASRM']
  }

  defineDefaultState () {
    return {
      serverResponse: '',
      signatureResponse: '',
      fb_id: '',
      ps_id: '',
      wallet: '',
      web3: '',
      asrmToken: '',
      balance: '',
    }
  }
}

export default new claimASRMRedux()
