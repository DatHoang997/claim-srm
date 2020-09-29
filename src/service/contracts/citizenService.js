import BaseService                          from '../../model/BaseService'
import PocPoolService                       from '@/service/contracts/pocPoolService'
import { thousands, weiToPOC, hideAddress } from '@/util/help.js'
import _                                    from 'lodash'
import arrayToTree                          from 'array-to-tree'

let refTree = []
let refArrayTree = []
let store
let contract
let citizenRedux
let isCitizen = {}
let pocPoolService
let initRefTree = false
let current_username
export default class extends BaseService {
  async addCitizen (username, ref_by, wallet_address) {
    store = this.store.getState()
    contract = store.contracts.citizen
    citizenRedux = this.store.getRedux('citizen')
    contract.methods.addCitizen(username, ref_by, wallet_address).send({ from: store.user.wallet, gasPrice: '0' }).then((balance) => {
      // const pocTokenBalanceRedux = this.store.getRedux('pocToken')
      // this.dispatch(pocTokenBalanceRedux.actions.pocTokenBalance_update(balance))
    })
  }

  async updateRefUsername (username = false, month = false, monthType = 'this_month') {
    if (username == false) {
      username = current_username
    } else {
      current_username = username
    }
    pocPoolService = new PocPoolService()
    store = this.store.getState()
    contract = store.contracts.citizen
    citizenRedux = this.store.getRedux('citizen')
    refArrayTree = []
    isCitizen = []
    refTree = []
    if (monthType == 'last_month') {
      this.dispatch(citizenRedux.actions.refTreeLastMonth_reset())
    } else {
      this.dispatch(citizenRedux.actions.refTree_reset())
    }

    if (!month) {
      let d = new Date()
      let _month = d.getMonth()
      let _year = d.getFullYear()
      if (_month == 0) {
        _month = 12
        _year--
      }
      month = _month + "" + _year // Last month
    }

    if (!username) return false
    refTree = [{
      id: username,
      title: username,
      subtitle: thousands(weiToPOC(await pocPoolService.getDirectRevenue(username, "all", month))),
      expanded: true,
      children: []
    }]

    if (monthType == 'last_month') {
      this.dispatch(citizenRedux.actions.refTreeLastMonth_update(refTree))
    } else {
      this.dispatch(citizenRedux.actions.refTree_update(refTree))
    }
    this.getChild(username, month, 1, monthType)
  }

  async getChild (username, month, level, monthType = 'this_month') {
    pocPoolService = new PocPoolService()
    store = this.store.getState()
    contract = store.contracts.citizen
    citizenRedux = this.store.getRedux('citizen')
    let childs = await contract.methods.getRefsTo(username).call()
    for (let child in childs) {
      if (!isCitizen[childs[child]]) {
        isCitizen[childs[child]] = true
        refArrayTree.push({ id: childs[child], title: childs[child], subtitle: thousands(weiToPOC(await pocPoolService.getDirectRevenue(childs[child], "all", month))), parent: username, expanded:level < 1})
        refTree[0].children = arrayToTree(refArrayTree, {
          parentProperty: 'parent',
          childrenProperty: 'children',
          customID: 'id'
        })
      }

      if (monthType == 'last_month') {
        this.dispatch(citizenRedux.actions.refTreeLastMonth_update(refTree))
      } else {
        this.dispatch(citizenRedux.actions.refTree_update(refTree))
      }
      this.getChild(childs[child], month, level + 1)
    }
  }

  async getUsernameFromWallet (wallet_address, month) {
    store = this.store.getState()
    contract = store.contracts.citizen
    citizenRedux = this.store.getRedux('citizen')
    let username = await contract.methods.getUsernameFromWallet(wallet_address).call()
    this.dispatch(citizenRedux.actions.usernames_update(username))
    if (!initRefTree) {
      this.updateRefUsername(username, month)
      current_username = username
    }
    initRefTree = true
  }

  // async checkAdmin (wallet_address) {
  //   store = this.store.getState()
  //   contract = store.contracts.citizen
  //   citizenRedux = this.store.getRedux('citizen')
  //   // let isAdmin = await contract.methods.isAdmin(wallet_address).call()
  //   let isAdmin = true
  //   this.dispatch(citizenRedux.actions.isAdmin_update(isAdmin))
  // }
}
