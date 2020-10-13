import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import StandardPage from '../StandardPage'
import { Tabs } from 'antd'
import ClaimAsrmService from '@/service/ClaimASRMService'
import Bounty from '../claimASRM/index'
import Swap from '../swapSRM/index'
import { LoadingOutlined } from '@ant-design/icons'
import {thousands, weiToPOC, hideAddress, hideLink, pocToWei, usdtToWei, weiToUSDT} from '@/util/help.js'
import {ArrowDownOutlined} from '@ant-design/icons'
import bigDecimal from 'js-big-decimal'
import 'antd/dist/antd.css';
import './style.scss'

const {TabPane} = Tabs;

const home = () => {
  const dispatch = useDispatch(),
        serverResponse = useSelector(state => state.claimASRM.serverResponse),
        signatureResponse = useSelector(state => state.claimASRM.signatureResponse),
        [srmAddress, setSrmAddress] = useState(''),
        balance = useSelector(state => state.claimASRM.balance),
        [fbId, setFbId] = useState(''),
        [err, setErr] = useState(''),
        [disableSubmit, setDisableSubmit] = useState(false),
        [asrmAmount, setAsrmAmount] = useState(''),
        [srmAmount, setSrmAmount] = useState(0)

  const claimAsrmService = new ClaimAsrmService()

  const regexp = {
    ETH: /^0x[a-fA-F0-9]{40}$/,
    NUM: /^[0-9]+(\.[0-9]+)?$/
  }

  useEffect(() => {
    claimAsrmService.asrmBalance()
  }, [])

  return (
    <StandardPage>
    <div className="merchant-management-page desktop-padding">
      <h3 className="text-primary-green left-align padding-left-xs">EzDefi bounty</h3>
      <Tabs>
        <TabPane tab='Bounty' key="1">
          <Bounty/>
        </TabPane>
        <TabPane tab='Swap' key="2">
          <Swap/>
        </TabPane>
      </Tabs>
    </div>
  </StandardPage>
  )
}

export default home;
