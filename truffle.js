const HDWalletProvider = require('truffle-hdwallet-provider');

// 0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d
var localPKey = 'a0cf475a29e527dcb1c35f66f1d78852b14d5f5109f75fa4b38fbe46db2022a5'
var localEndPoint = 'http://127.0.0.1:8545'

var devPKey = 'a0cf475a29e527dcb1c35f66f1d78852b14d5f5109f75fa4b38fbe46db2022a5'
var devEndPoint = 'wss://ws.ezdefi.com'

var mainPKey = '44c8bd3d74c2093d73fb769b1f4259cf372bb7fd3fbc4c9b540dc48672dc0b16'
var mainEndPoint = 'https://rpc.ezdefi.com'

module.exports = {
  networks: {
    localhost: {
      provider: () => new HDWalletProvider(localPKey, localEndPoint),
      network_id: 111111
    },
    development: {
      provider: () => new HDWalletProvider(devPKey, devEndPoint),
      network_id: 111111
    },
    production: {
      provider: () => new HDWalletProvider(mainPKey, mainEndPoint),
      network_id: 66666
    }
  },
  compilers: {
    solc: {
      version: '0.5.5'
    }
  }
}