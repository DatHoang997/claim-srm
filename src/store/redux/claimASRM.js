import BaseRedux from '@/model/BaseRedux'

class claimASRMRedux extends BaseRedux {
  defineTypes () {
    return ['claimASRM']
  }

  defineDefaultState () {
    return {
      serverResponse: '',
      signatureResponse: '',
      _ezdref: '',
      subid: '',
      wallet: undefined,
      web3: '',
      asrmToken: '',
      balance: '',
      name: '',
      address: '',
      phone: '',
      viettel: '',
      dbWallet: '',
      formResponse: '',
    }
  }
}

export default new claimASRMRedux()
